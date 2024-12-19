import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { addDoc, collection, doc } from 'firebase/firestore'

export async function POST(
  request: NextRequest,
  { params }: { params: { contactId: string } }
) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    const contactRef = doc(db, 'contacts', params.contactId)
    const notesCollection = collection(contactRef, 'notes')
    
    await addDoc(notesCollection, {
      content,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
} 