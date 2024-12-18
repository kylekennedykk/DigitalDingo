import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function DELETE(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    // Try to delete from contacts collection
    let deleted = false
    try {
      await db.collection('contacts').doc(params.contactId).delete()
      deleted = true
    } catch (error) {
      console.log('Not found in contacts, trying chatContacts')
    }

    // If not found in contacts, try chatContacts
    if (!deleted) {
      await db.collection('chatContacts').doc(params.contactId).delete()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    const { status } = await request.json()
    
    if (!['new', 'in-progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
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
        status,
        lastUpdated: Timestamp.now()
      })

      const updatedContact = await chatContactRef.get()
      return NextResponse.json(updatedContact.data())
    }

    // Update contacts document
    await contactRef.update({
      status,
      lastUpdated: Timestamp.now()
    })

    const updatedContact = await contactRef.get()
    return NextResponse.json(updatedContact.data())
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
} 