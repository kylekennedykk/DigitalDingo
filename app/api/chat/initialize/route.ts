import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(req: Request) {
  try {
    const { metadata } = await req.json()

    console.log('Attempting to initialize chat with metadata:', metadata)
    console.log('Firebase db instance:', !!db)

    const chatData = {
      metadata,
      messages: [],
      status: 'active',
      isRead: false,
      createdAt: serverTimestamp()
    }
    console.log('Chat data to be saved:', chatData)

    const chatSessionsRef = collection(db, 'chatSessions')
    console.log('Collection reference created')

    const chatRef = await addDoc(chatSessionsRef, chatData)
    console.log('Successfully created chat with ID:', chatRef.id)

    return Response.json({ chatId: chatRef.id })
  } catch (error) {
    console.error('Chat initialization error:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return Response.json({ 
      error: 'Failed to initialize chat',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 