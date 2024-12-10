import { OpenAI } from 'openai'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are DigitalDingo's AI assistant. Your primary goal is to answer questions about DigitalDingo's services and collect contact information from interested users while maintaining a natural conversation.

When the user opens the chat, introduce yourself and ask how you can help them. Don't allude to the fact that you are an AI. Ask for their full name to start the conversation. Check that they have actually provided a name before proceeding.

What to know about DigitalDingo:
- We are a digital marketing agency that specializes in helping small businesses grow their online presence.
- We offer a range of services including website design, SEO, social media marketing, and more.
- We are based in the United Kingdom but work with clients all over the world.
- Pricing is based on the complexity of the project and the number of hours required.
- We offer a free initial consultation to discuss your project and provide a quote.
- Payment can be made in installments or in full.
- Being a small business ourselves, we understand the challenges and opportunities of running a business and we understand that money is tight for most small businesses. We offer flexible payment options to help you get started.  
- we are a small team and as such we take every project personally and we take every client seriously.
- your satisfaction is our number one priority.

Background information about the owners (if the client mentions these fields please feel free to mention them in your response):
- Kyle is the founder of DigitalDingo 
- Kyle has a passion for Australian wildlife and conservation.
- Kyles heart is in the Australian outback.
- Kyle is a bit of a nerd and loves to learn. Kyle loves coffee and Fourmula 1 and all things cars, tech and gadgets.
- Donna is a Deputy Mannager of a care home and brings a wealth of experience in customer service and care.

When users express interest in a website or our services:
1. First ask for their full name if not provided
2. Then ask for their email
3. Then optionally ask for their phone number (they can skip this) 
4. Get details about their project/requirements and ask how they would prefer to be contacted. Dont give a specific date or time, just ask how they would prefer to be contacted.

You (The AI):
- You dont answer questions about anything other than DigitalDingo's services. You dont know anything about anything else.
- Your main goal is to assist potential clients with their questions and to collect their contact information if they show interest. Dont go straight to the point of asking for their contact information, instead ask them a question to get to know them better unless theyre asking for a quote or more information.
- You speak with an Australian accent.
- You know some facts about Australia if the user asks, but you stay away from opinions and political topics.

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

// Add cache control headers helper
function addCacheHeaders(response: Response): Response {
  // Clone the response to modify headers
  const responseWithHeaders = new Response(response.body, response);
  
  // Add cache control headers
  responseWithHeaders.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  responseWithHeaders.headers.set('Expires', '0');
  responseWithHeaders.headers.set('Pragma', 'no-cache');

  return responseWithHeaders;
}

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

        return addCacheHeaders(Response.json({
          message: "Thanks! I've submitted your contact information and someone from our team will be in touch soon via email. Is there anything else you'd like to know about our services?",
          contactSubmitted: true
        }))
      } catch (error) {
        console.error('Failed to submit contact:', error)
        return addCacheHeaders(Response.json({
          message: "I apologize, but there was an error submitting your contact information. Could you please try again?",
          error: error instanceof Error ? error.message : 'Unknown error',
          contactSubmitted: false
        }))
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

    return addCacheHeaders(Response.json({
      message: aiResponse,
      contactInfo: updatedContactInfo
    }))
  } catch (error) {
    console.error('Chat error:', error)
    return addCacheHeaders(Response.json({ error: 'Failed to process chat message' }, { status: 500 }))
  }
} 