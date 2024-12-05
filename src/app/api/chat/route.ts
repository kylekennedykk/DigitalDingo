import { OpenAI } from 'openai'
import { db } from '@/lib/firebase/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are DigitalDingo's AI assistant. Your primary goal is to collect contact information from interested users while maintaining a natural conversation.

When users express interest in a website or our services:
1. First ask for their name if not provided
2. Then ask for their email
3. Then optionally ask for their phone number (they can skip this)
4. Get details about their project/requirements

Example conversation flow:
User: "I need a website for my farm"
Assistant: "That sounds like an interesting project! I'd love to help connect you with our team. First, could you tell me your name?"

User: "John Smith"
Assistant: "Nice to meet you, John! What's the best email address to reach you at?"

User: "john@example.com"
Assistant: "Thanks! Would you like to provide a phone number? It's optional, so feel free to say 'skip' if you prefer."

User: "skip"
Assistant: "No problem! Could you tell me more about your farm website project? What features are you looking for?"

Keep the conversation natural and friendly. After collecting the required information (name, email, project details), inform them that someone from the team will be in touch soon.`

export async function POST(req: Request) {
  try {
    const { message, chatId, messages, contactInfo } = await req.json()
    console.log('Chat request received:', { message, chatId, contactInfo })

    // If we have complete contact info, submit it
    if (contactInfo?.complete) {
      console.log('Contact info is complete, attempting submission:', contactInfo)
      try {
        const response = await fetch(new URL('/api/chat/submit-contact', req.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...contactInfo,
            chatId
          })
        })

        const responseData = await response.json()
        console.log('Contact submission response:', responseData)

        if (!response.ok) {
          throw new Error(`Failed to submit contact: ${JSON.stringify(responseData)}`)
        }

        return Response.json({
          message: "Thanks! I've submitted your contact information and someone from our team will be in touch soon via email. Is there anything else you'd like to know about our services?",
          contactSubmitted: true
        })
      } catch (error) {
        console.error('Failed to submit contact:', error)
        return Response.json({
          message: "I apologize, but there was an error submitting your contact information. Could you please try again?",
          error: error instanceof Error ? error.message : 'Unknown error',
          contactSubmitted: false
        })
      }
    }

    // Regular chat flow
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        { role: "user", content: message }
      ]
    })

    const aiResponse = completion.choices[0].message.content

    // Extract contact info if present
    let updatedContactInfo = contactInfo || {}
    if (!contactInfo?.complete) {
      // Extract email from message
      if (message.includes('@') && !updatedContactInfo.email) {
        updatedContactInfo.email = message
      }
      
      // Extract name if AI just asked for it
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === 'assistant' && 
          lastMessage.content.toLowerCase().includes('your name') &&
          message.length > 0) {
        updatedContactInfo.name = message
      }

      // Extract message/project details if AI just asked about it
      if (lastMessage?.role === 'assistant' && 
          (lastMessage.content.toLowerCase().includes('about your project') ||
           lastMessage.content.toLowerCase().includes('tell me more')) &&
          message.length > 0) {
        updatedContactInfo.message = message
      }
    }

    // Check if we have all required fields
    updatedContactInfo.complete = Boolean(
      updatedContactInfo.name && 
      updatedContactInfo.email && 
      updatedContactInfo.message
    )

    // Update chat in Firebase
    if (chatId) {
      const chatRef = doc(db, 'chatSessions', chatId)
      await updateDoc(chatRef, {
        messages: [
          ...messages,
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: aiResponse, timestamp: new Date() }
        ]
      })
    }

    return Response.json({
      message: aiResponse,
      contactInfo: updatedContactInfo
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Failed to process chat message' }, { status: 500 })
  }
} 