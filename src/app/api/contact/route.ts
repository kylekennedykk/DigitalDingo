import { db } from '@/lib/firebase/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, phone, message } = data

    // Save to Firebase
    const contactRef = await addDoc(collection(db, 'contacts'), {
      name,
      email,
      phone,
      message,
      status: 'new',
      createdAt: serverTimestamp(),
      source: 'chat',
      notes: [],
      lastUpdated: serverTimestamp()
    })

    // Send email notification using Resend
    await resend.emails.send({
      from: 'DigitalDingo <hello@digitaldingo.uk>',
      to: 'hello@digitaldingo.uk',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Source:</strong> AI Chat</p>
          <hr />
          <p style="color: #666; font-size: 14px;">
            This contact was submitted through the AI chat assistant on digitaldingo.uk
          </p>
        </div>
      `,
      replyTo: email
    })

    return Response.json({ success: true, id: contactRef.id })
  } catch (error) {
    console.error('Contact submission error:', error)
    return Response.json({ 
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 