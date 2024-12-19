import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/firebase'
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'

interface RouteParams {
  params: {
    contactId: string;
  }
}

interface NoteData {
  note: string;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contactId } = params
    const { note } = (await request.json()) as NoteData

    if (!note) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    const contactRef = doc(db, 'contacts', contactId)
    
    await updateDoc(contactRef, {
      notes: arrayUnion({
        content: note,
        timestamp: Timestamp.now(),
      })
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