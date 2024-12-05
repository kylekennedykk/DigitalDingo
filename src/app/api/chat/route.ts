import { OpenAI } from 'openai'
import { db } from '@/lib/firebase/firebase'
import { doc, updateDoc, DocumentData } from 'firebase/firestore'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are DigitalDingo's AI assistant, speaking with a light Australian accent. You help potential clients learn about web design services and assist with contact form submissions. Be professional, friendly, and avoid emojis.

Key information about DigitalDingo:
- Professional web design company based in Australia
- Specializes in modern, responsive website design
- Offers custom web development solutions
- Creates portfolio websites and business websites
- Provides ongoing website maintenance and support
- Uses latest technologies like React, Next.js, and Tailwind CSS

When users want to submit a contact form or ask about pricing:
1. Tell them you'll help gather their information for a contact submission
2. Collect the following details one by one:
   - Full Name
   - Email Address
   - Phone Number (mention it's optional)
   - Project Details/Requirements
3. After collecting all details, say you'll submit the form for them
4. Submit the contact form using the collected information
5. Confirm the submission was successful

Example contact form flow:
User: "I'd like to know about pricing"
Assistant: "I'll help you submit a contact form so our team can provide you with a customized quote. First, could you please tell me your full name?"
User: "John Smith"
Assistant: "Thanks John! What's your email address so we can reach you?"
User: "john@example.com"
Assistant: "Perfect. Could I also get your phone number? This is optional but helpful for quick follow-ups."
User: "0412345678"
Assistant: "Great! Lastly, could you briefly describe your project or what kind of website you're looking for?"
User: "I need a business website with online booking"
Assistant: "Thank you for providing those details. I'll submit a contact form for you right now."
[Submit form]
Assistant: "I've submitted your contact request successfully! Kyle or Donna will be in touch soon to discuss your business website and online booking requirements. Is there anything else you'd like to know about our services?"

Remember to maintain a friendly, professional tone and keep responses focused on DigitalDingo's services.`

// Update the submitContactForm function
async function submitContactForm(formData: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    // Use relative URL instead of hardcoded localhost
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Contact form submission error:', error) // Add debug log
      throw new Error(error.message || 'Failed to submit contact form')
    }

    const data = await response.json()
    console.log('Contact form submission response:', data) // Add debug log
    return data.success
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return false
  }
}

// Update the POST function to handle contact form submission
export async function POST(req: Request) {
  try {
    const { message, chatId, messages } = await req.json()
    console.log('Processing chat message:', { chatId, message })

    // Check if we have all contact form details
    const contactInfo = extractContactInfo(messages)
    console.log('Contact info extracted:', contactInfo) // Debug log

    if (contactInfo.isComplete) {
      console.log('Attempting to submit contact form:', contactInfo.data) // Debug log
      const submitted = await submitContactForm(contactInfo.data)
      console.log('Contact form submission result:', submitted) // Debug log

      if (submitted) {
        return Response.json({
          message: "I've submitted your contact request successfully! Kyle or Donna will be in touch soon to discuss your requirements. Is there anything else you'd like to know about our services?"
        })
      } else {
        return Response.json({
          message: "I apologize, but there was an issue submitting the contact form. Please try again or email us directly at hello@digitaldingo.uk"
        })
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0].message.content

    // Update chat in Firebase
    if (chatId) {
      console.log('Updating chat in Firebase:', chatId)
      const chatRef = doc(db, 'chatSessions', chatId)
      await updateDoc(chatRef, {
        messages: [
          ...messages,
          { 
            role: 'user', 
            content: message, 
            timestamp: new Date().toISOString() 
          },
          { 
            role: 'assistant', 
            content: reply, 
            timestamp: new Date().toISOString() 
          }
        ]
      })
      console.log('Chat updated successfully')
    }

    return Response.json({ message: reply })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}

// Helper function to extract contact information from messages
function extractContactInfo(messages: ChatMessage[]) {
  let name = ''
  let email = ''
  let phone = ''
  let projectDetails = ''
  let isCollectingInfo = false

  for (const message of messages) {
    const content = message.content.toLowerCase()
    
    // Check if we're in contact form collection mode
    if (message.role === 'assistant' && content.includes('contact form')) {
      isCollectingInfo = true
      continue
    }

    if (!isCollectingInfo) continue

    if (message.role === 'user') {
      // Try to identify the type of information based on the previous assistant message
      const prevMessage = messages[messages.indexOf(message) - 1]
      if (prevMessage?.role === 'assistant') {
        const prevContent = prevMessage.content.toLowerCase()
        if (prevContent.includes('name')) {
          name = message.content
        } else if (prevContent.includes('email')) {
          email = message.content
        } else if (prevContent.includes('phone')) {
          phone = message.content
        } else if (prevContent.includes('project') || prevContent.includes('website')) {
          projectDetails = message.content
        }
      }
    }
  }

  const isComplete = name && email && projectDetails
  return {
    isComplete,
    data: {
      name,
      email,
      phone,
      message: projectDetails
    }
  }
} 