import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { Contact } from '@/lib/types'

export async function GET() {
  try {
    // Fetch regular contacts
    const contactsSnapshot = await db.collection('contacts')
      .orderBy('createdAt', 'desc')
      .get()

    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'contact' as const,
      ...doc.data()
    })) as Contact[]

    // Fetch chat contacts
    const chatContactsSnapshot = await db.collection('chatContacts')
      .orderBy('createdAt', 'desc')
      .get()

    const chatContacts = chatContactsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'chatContact' as const,
      ...doc.data()
    })) as Contact[]

    // Combine and sort both types of contacts by createdAt
    const allContacts = [...contacts, ...chatContacts]
      .sort((a, b) => {
        const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0
        const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0
        return bTime - aTime
      })

    return NextResponse.json({ contacts: allContacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
} 