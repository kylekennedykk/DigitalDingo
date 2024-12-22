import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function POST(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    const { content } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const now = new Date()
    const timestamp = Timestamp.fromDate(now)

    // Create note
    const note = {
      id: crypto.randomUUID(),
      content: content.trim(),
      timestamp: {
        _seconds: timestamp.seconds,
        _nanoseconds: timestamp.nanoseconds
      },
      author: {
        email: 'admin@digitaldingo.uk',
        name: 'Admin'
      }
    }

    // Try contacts collection first
    const contactRef = db.collection('contacts').doc(params.contactId)
    let contact = await contactRef.get()

    if (!contact.exists) {
      // Try chatContacts if not found in contacts
      const chatContactRef = db.collection('chatContacts').doc(params.contactId)
      contact = await chatContactRef.get()
      
      if (!contact.exists) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }

      // Update chatContacts document
      await chatContactRef.update({
        notes: [...(contact.data()?.notes || []), note],
        lastUpdated: timestamp
      })

      const updatedContact = await chatContactRef.get()
      return NextResponse.json(updatedContact.data())
    }

    // Update contacts document
    await contactRef.update({
      notes: [...(contact.data()?.notes || []), note],
      lastUpdated: timestamp
    })

    const updatedContact = await contactRef.get()
    return NextResponse.json(updatedContact.data())
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
} 