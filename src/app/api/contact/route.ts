import { db } from '@/lib/firebase/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return Response.json({
        error: 'Missing required fields',
        details: 'Name, email and message are required'
      }, { status: 400 })
    }

    // Save to Firebase
    const contactRef = await addDoc(collection(db, 'contacts'), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
      source: data.source || 'web',
      notes: [],
      lastUpdated: serverTimestamp()
    })

    // Send email notification
    try {
      await resend.emails.send({
        from: 'DigitalDingo <hello@digitaldingo.uk>',
        to: 'hello@digitaldingo.uk',
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            <p><strong>Source:</strong> ${data.source || 'Web Form'}</p>
          </div>
        `,
        replyTo: data.email
      })
    } catch (error) {
      console.error('Failed to send email notification:', error)
      // Continue even if email fails
    }

    return Response.json({ 
      success: true, 
      id: contactRef.id 
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    return Response.json({ 
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 