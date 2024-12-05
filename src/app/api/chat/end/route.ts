import { db } from '@/lib/firebase/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function POST(req: Request) {
  try {
    const { chatId, endTime, duration } = await req.json()

    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      'metadata.endTime': endTime,
      'metadata.duration': duration,
      status: 'ended'
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Chat end error:', error)
    return Response.json({ error: 'Failed to end chat' }, { status: 500 })
  }
} 