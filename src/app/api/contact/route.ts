import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Name, email and message are required'
      }, { status: 400 })
    }

    // Send email notification
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
          <p><strong>Source:</strong> Web Form</p>
        </div>
      `,
      replyTo: data.email
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ 
      error: 'Failed to process contact form submission' 
    }, { status: 500 })
  }
} 