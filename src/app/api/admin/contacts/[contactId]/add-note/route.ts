import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { auth } from 'firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

interface RouteParams {
  params: {
    contactId: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  try {
    // Get and validate params first
    const contactId = await params.contactId
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400, headers }
      )
    }

    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401, headers }
      )
    }

    // Verify the token and get user info
    let userRecord
    try {
      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await auth().verifyIdToken(token)
      userRecord = await auth().getUser(decodedToken.uid)
      console.log('Token verified for user:', userRecord.email)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers }
      )
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400, headers }
      )
    }

    const db = getFirestore()
    
    // Create note with user info
    const note = {
      id: crypto.randomUUID(),
      content: content.trim(),
      timestamp: Timestamp.now(),
      createdBy: {
        uid: userRecord.uid,
        email: userRecord.email,
        ...(userRecord.displayName && { name: userRecord.displayName })
      }
    }
    console.log('Created note with timestamp:', note.timestamp)

    // Try contacts collection first
    const contactRef = db.collection('contacts').doc(contactId)
    let contact = await contactRef.get()

    if (!contact.exists) {
      // Try chatContacts if not found in contacts
      const chatContactRef = db.collection('chatContacts').doc(contactId)
      contact = await chatContactRef.get()
      
      if (!contact.exists) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404, headers }
        )
      }

      // Update chatContacts document
      await chatContactRef.update({
        notes: FieldValue.arrayUnion(note),
        lastUpdated: Timestamp.now()
      })

      const updatedContact = await chatContactRef.get()
      return NextResponse.json(updatedContact.data(), { headers })
    }

    // Update contacts document
    await contactRef.update({
      notes: FieldValue.arrayUnion(note),
      lastUpdated: new Date().toISOString()
    })

    const updatedContact = await contactRef.get()
    return NextResponse.json(updatedContact.data(), { headers })

  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500, headers }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 