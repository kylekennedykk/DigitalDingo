'use client'

import { useState, useEffect } from 'react'
import { chatService } from '@/lib/services/chatService'

export default function ChatWindow() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await chatService.createSession()
        console.log('Session created with ID:', newSessionId)
        setSessionId(newSessionId)
      } catch (error) {
        console.error('Failed to create chat session:', error)
        setError('Failed to initialize chat')
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [])

  // Rest of the component...
} 