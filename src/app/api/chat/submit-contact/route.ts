import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ChatContactSubmission {
  name: string
  email: string
  phone?: string
  message: string
  chatId: string
}

export async function POST(req: Request) {
  try {
    console.log('Received contact submission request')
    const data: ChatContactSubmission = await req.json()
    console.log('Parsed contact data:', data)
    
    // Validate required fields
    if (!data.name || !data.email || !data.message || !data.chatId) {
      console.log('Missing required fields:', { data })
      return Response.json({
        error: 'Missing required fields',
        details: 'Name, email, message and chatId are required'
      }, { status: 400 })
    }

    console.log('Adding contact to Firebase...')
    try {
      // Save to Firebase
      const contactRef = await addDoc(collection(db, 'chatContacts'), {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        chatId: data.chatId,
        status: 'new',
        createdAt: serverTimestamp(),
        notes: [],
        lastUpdated: serverTimestamp(),
        source: 'ai_chat'
      })
      console.log('Successfully added to Firebase with ID:', contactRef.id)

      // Send email notification
      try {
        await resend.emails.send({
          from: 'DigitalDingo <hello@digitaldingo.uk>',
          to: 'hello@digitaldingo.uk',
          subject: `New AI Chat Contact Submission from ${data.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Contact Form Submission via AI Chat</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p><strong>Message:</strong> ${data.message}</p>
              <p><strong>Chat ID:</strong> ${data.chatId}</p>
              <p><em>This contact was submitted through the AI chat assistant</em></p>
            </div>
          `,
          replyTo: data.email
        })
        console.log('Email notification sent successfully')
      } catch (error) {
        console.error('Failed to send email notification:', error)
        // Continue even if email fails
      }

      return Response.json({ 
        success: true, 
        id: contactRef.id 
      })
    } catch (firebaseError) {
      console.error('Firebase error:', firebaseError)
      throw firebaseError
    }
  } catch (error) {
    console.error('Chat contact submission error:', error)
    return Response.json({ 
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 