'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Loader2, Send } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMetadata {
  startTime: Date
  endTime?: Date
  duration?: string
  userAgent: string
  platform: string
  language: string
  screenResolution: string
  timezone: string
  ipAddress?: string
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

export function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [isAwaitingName, setIsAwaitingName] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    console.log('Initializing chat...')
    try {
      // Gather metadata
      const metadata: ChatMetadata = {
        startTime: new Date(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }

      console.log('Gathered metadata:', metadata)

      // Get IP and location data
      try {
        const response = await fetch('https://ipapi.co/json/')
        const locationData = await response.json()
        metadata.ipAddress = locationData.ip
        metadata.location = {
          country: locationData.country_name,
          region: locationData.region,
          city: locationData.city,
        }
        console.log('Location data:', locationData)
      } catch (error) {
        console.error('Error fetching location:', error)
      }

      setMetadata(metadata)

      const chatData = {
        metadata,
        messages: [],
        status: 'active',
        isRead: false,
        userName: '',
        createdAt: new Date()
      }

      // Initialize chat in Firebase
      console.log('Sending initialization request...')
      const response = await fetch('/api/chat/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to initialize chat: ${JSON.stringify(errorData)}`)
      }

      const { chatId } = await response.json()
      console.log('Chat initialized with ID:', chatId)
      setChatId(chatId)

      // Add welcome message asking for name
      setMessages([{
        role: 'assistant',
        content: "G'day! I'm the DigitalDingo assistant. Before we start, could you please tell me your name?",
        timestamp: new Date()
      }])
      setIsAwaitingName(true)
    } catch (error) {
      console.error('Error initializing chat:', error)
    }
  }

  const handleOpen = () => {
    console.log('Opening chat...')
    setIsOpen(true)
    if (!chatId) {
      initializeChat()
    }
  }

  const handleClose = async () => {
    console.log('Closing chat...')
    if (chatId && metadata) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - metadata.startTime.getTime()) / 1000)
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      const durationString = `${minutes}m ${seconds}s`

      await fetch('/api/chat/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          endTime,
          duration: durationString,
        }),
      })
    }
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { 
      role: 'user' as const, 
      content: input, 
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (isAwaitingName) {
        // Save the user's name
        setUserName(input)
        setIsAwaitingName(false)
        
        // Update chat in Firebase with user's name
        if (chatId) {
          const chatRef = doc(db, 'chatSessions', chatId)
          await updateDoc(chatRef, {
            userName: input
          })
        }

        // Add response after getting name
        const assistantMessage: Message = {
          role: 'assistant',
          content: `Nice to meet you, ${input}! How can I help you with your web design needs today?`,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          chatId,
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.message,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 p-4 bg-neutral-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Chat with DigitalDingo</h3>
              <button onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 