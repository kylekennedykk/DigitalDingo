import { 
  type Firestore,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type CollectionReference,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore/lite'
import { firebaseApp } from '@/lib/firebase/firebase'

const db = getFirestore(firebaseApp)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

class ChatService {
  private sessionsRef: CollectionReference

  constructor() {
    this.sessionsRef = collection(db, 'chatSessions')
  }

  async createSession(): Promise<string> {
    try {
      const newSession = await addDoc(this.sessionsRef, {
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return newSession.id
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw new Error('Failed to create chat session')
    }
  }

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'timestamp'>): Promise<void> {
    try {
      const sessionRef = doc(this.sessionsRef, sessionId)
      const sessionDoc = await getDoc(sessionRef)

      if (!sessionDoc.exists()) {
        throw new Error('Chat session not found')
      }

      const messageData = {
        ...message,
        timestamp: new Date()
      }

      const currentData = sessionDoc.data()
      const updatedMessages = [...(currentData.messages || []), messageData]

      await updateDoc(sessionRef, {
        messages: updatedMessages,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error adding message:', error)
      throw new Error('Failed to add message')
    }
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const sessionRef = doc(this.sessionsRef, sessionId)
      const sessionDoc = await getDoc(sessionRef)

      if (!sessionDoc.exists()) {
        throw new Error('Chat session not found')
      }

      const data = sessionDoc.data()
      return data.messages || []
    } catch (error) {
      console.error('Error getting messages:', error)
      throw new Error('Failed to get messages')
    }
  }
}

export const chatService = new ChatService() 