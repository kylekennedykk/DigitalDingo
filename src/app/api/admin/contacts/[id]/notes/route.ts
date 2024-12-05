import { NextResponse } from 'next/server'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import app from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Firestore
    const db = getFirestore(app)
    
    // Get session cookie
    const session = cookies().get('session')?.value
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify session and get user info
    try {
      const auth = getAuth(app)
      const decodedClaims = await auth.verifySessionCookie(session)
      const userRecord = await auth.getUser(decodedClaims.uid)

      // Parse request body
      const body = await request.json()

      if (!body.content?.trim()) {
        return NextResponse.json(
          { error: 'Note content is required' },
          { status: 400 }
        )
      }

      // Create note
      const newNote = {
        id: crypto.randomUUID(),
        content: body.content.trim(),
        createdAt: new Date().toISOString(),
        createdBy: {
          email: userRecord.email,
          ...(userRecord.displayName && { name: userRecord.displayName })
        }
      }

      // Update contact
      const docRef = db.collection('contacts').doc(params.id)
      const contactDoc = await docRef.get()
      
      if (!contactDoc.exists) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }

      await docRef.update({
        notes: FieldValue.arrayUnion(newNote),
        lastUpdated: new Date().toISOString()
      })

      // Get updated contact
      const updatedDoc = await docRef.get()
      const updatedData = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
      
      return NextResponse.json(updatedData)
    } catch (authError) {
      console.error('Session verification failed:', authError)
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
} 