'use client'

import { useChat } from 'ai/react'
import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { chatService } from '@/lib/services/chatService'

export function ChatWindow() {
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await chatService.createSession()
        console.log('Session created with ID:', newSessionId)
        setSessionId(newSessionId)
      } catch (error) {
        console.error('Failed to create session:', error)
      }
    }
    initSession()
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    id: sessionId,
    body: {
      sessionId
    },
    onError: (error) => {
      console.log('Current sessionId:', sessionId)
      console.error('Chat error:', error)
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId) {
      console.error('No session ID available')
      return
    }
    handleSubmit(e)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={sessionId ? "Type your message..." : "Initializing chat..."}
            rows={1}
            className="w-full pr-10 resize-none rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={!sessionId || isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !sessionId}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {error && (
          <div className="mt-2 text-sm text-red-500">
            Error: {error.message}
          </div>
        )}
      </div>
    </div>
  )
} 