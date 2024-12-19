import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Timestamp, FieldValue } from 'firebase-admin/firestore'

type NoteData = {
  note: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { contactId: string } }
) {
  try {
    const contactId = params.contactId
    const { note } = (await request.json()) as NoteData

    if (!note) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    const contactRef = db.collection('contacts').doc(contactId)
    
    await contactRef.update({
      notes: FieldValue.arrayUnion({
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