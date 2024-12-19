import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { contactId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Note content is required' }, 
        { status: 400 }
      )
    }

    const contactRef = doc(db, 'contacts', params.contactId)
    const contactSnap = await getDoc(contactRef)

    if (!contactSnap.exists()) {
      return NextResponse.json(
        { error: 'Contact not found' }, 
        { status: 404 }
      )
    }

    const note = {
      content,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email
    }

    await updateDoc(contactRef, {
      notes: arrayUnion(note)
    })

    return NextResponse.json({ success: true, note })

  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' }, 
      { status: 500 }
    )
  }
} 