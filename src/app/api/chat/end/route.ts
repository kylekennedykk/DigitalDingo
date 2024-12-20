import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { chatId, endTime, duration } = await request.json()

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    try {
      // Update the chat session in Firebase
      const chatRef = doc(db, 'chatSessions', chatId)
      await updateDoc(chatRef, {
        status: 'ended',
        endTime: new Date(endTime),
        duration,
        updatedAt: new Date()
      })

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error('Firebase error:', dbError)
      return NextResponse.json(
        { error: 'Database update failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  }
} 