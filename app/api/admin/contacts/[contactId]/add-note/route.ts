import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: { contactId: string } }
): Promise<NextResponse> {
  try {
    const { note } = await request.json()
    const contactId = params.contactId

    if (!note || !contactId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const noteData = {
      content: note,
      createdAt: new Date().toISOString(),
    }

    await adminDb
      .collection('contacts')
      .doc(contactId)
      .collection('notes')
      .add(noteData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 