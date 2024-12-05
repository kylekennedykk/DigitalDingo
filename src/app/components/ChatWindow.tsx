import { useChat, Message } from 'ai/react'
import { nanoid } from 'nanoid'
import { useEffect, useState, useCallback, useRef, memo } from 'react'

const ChatMessage = memo(({ role, content }: { role: string; content: string }) => (
  <div className={`mb-4 ${role === 'assistant' ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg p-3`}>
    {content}
  </div>
))

ChatMessage.displayName = 'ChatMessage'

export default function ChatWindow() {
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false)
  const sessionIdRef = useRef<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize session ID first
  useEffect(() => {
    try {
      let id = localStorage.getItem('chat_session_id')
      
      if (!id || typeof id !== 'string' || id.trim() === '') {
        id = nanoid()
        localStorage.setItem('chat_session_id', id)
      }
      
      sessionIdRef.current = id
      setIsInitialized(true)
    } catch (error) {
      sessionIdRef.current = nanoid()
      setIsInitialized(true)
    }
  }, [])

  const chatConfig = useChat({
    api: '/api/chat',
    initialMessages: messages,
    headers: {
      'X-Session-ID': sessionIdRef.current,
    },
    body: {
      sessionId: sessionIdRef.current,
    },
    onResponse: (response) => {
      if (response.status === 200) {
        setErrorMessage(null)
      }
    },
    onFinish: (message) => {
      setMessages(prev => [...prev, message])
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  })

  const { input, handleInputChange, handleSubmit, isLoading } = chatConfig

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionIdRef.current) {
      setErrorMessage('Session not initialized')
      return
    }
    
    if (!input.trim()) return
    
    handleSubmit(e)
  }, [handleSubmit, input])

  // Don't render until fully initialized
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-full">Initializing chat...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        {isLoading && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            Thinking...
          </div>
        )}
      </div>
      
      <form onSubmit={onSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg"
          disabled={isLoading}
        />
      </form>
    </div>
  )
} 