import { NextResponse } from 'next/server'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Define interfaces for type safety
interface Contact {
  id: string
  type: 'contact' | 'chatContact'
  createdAt: Timestamp
  [key: string]: any // For other properties
}

// Initialize Firebase Admin if not already initialized
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0]

export async function GET() {
  try {
    const db = getFirestore(app)
    
    // Fetch regular contacts
    const contactsSnapshot = await db.collection('contacts')
      .orderBy('createdAt', 'desc')
      .get()

    const contacts: Contact[] = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'contact',
      ...doc.data()
    }))

    // Fetch chat contacts
    const chatContactsSnapshot = await db.collection('chatContacts')
      .orderBy('createdAt', 'desc')
      .get()

    const chatContacts: Contact[] = chatContactsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'chatContact',
      ...doc.data()
    }))

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