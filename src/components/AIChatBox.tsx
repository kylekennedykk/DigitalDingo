'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Loader2, Send } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date | string
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

interface ContactInfo {
  name?: string
  email?: string
  phone?: string
  message?: string
  complete?: boolean
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
  const [showPrompt, setShowPrompt] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPrompt(true)
      }
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [isOpen])

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
        timestamp: new Date().toISOString()
      }])
      setIsAwaitingName(true)
    } catch (error) {
      console.error('Error initializing chat:', error)
    }
  }

  const handleOpen = () => {
    console.log('Opening chat...')
    setIsOpen(true)
    setShowPrompt(false)
    if (!chatId) {
      initializeChat()
    }
  }

  const handleClose = async () => {
    console.log('Closing chat...')
    try {
      if (chatId && metadata) {
        const endTime = new Date()
        const duration = Math.floor((endTime.getTime() - metadata.startTime.getTime()) / 1000)
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        const durationString = `${minutes}m ${seconds}s`

        // Update Firebase directly instead of going through the API
        const chatRef = doc(db, 'chatSessions', chatId)
        await updateDoc(chatRef, {
          status: 'ended',
          endTime: endTime,
          duration: durationString,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.warn('Error during chat closure:', error)
    } finally {
      setIsOpen(false)
      setMessages([])
      setChatId(null)
      setMetadata(null)
      setUserName('')
      setIsAwaitingName(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setInput('')
      setIsLoading(true)

      // Add user message to chat
      setMessages(prev => [...prev, {
        role: 'user',
        content: input,
        timestamp: new Date()
      }])

      // Send chat request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          chatId,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          contactInfo
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      console.log('Chat response:', data)

      // Update contact info if provided
      if (data.contactInfo) {
        console.log('Updating contact info:', data.contactInfo)
        setContactInfo(prev => ({
          ...prev,
          ...data.contactInfo
        }))

        // If contact info is complete, submit it
        if (data.contactInfo.complete) {
          console.log('Contact info complete, submitting...')
          const submitResponse = await fetch('/api/chat/submit-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data.contactInfo,
              chatId
            })
          })

          if (!submitResponse.ok) {
            throw new Error('Failed to submit contact')
          }

          const submitData = await submitResponse.json()
          console.log('Contact submission response:', submitData)
        }
      }

      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }])

      // Update chat in Firebase
      if (chatId) {
        const chatRef = doc(db, 'chatSessions', chatId)
        await updateDoc(chatRef, {
          messages: [
            ...messages,
            { role: 'user', content: input, timestamp: new Date() },
            { role: 'assistant', content: data.message, timestamp: new Date() }
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 max-w-xs z-50"
          >
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="relative p-4">
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3 h-3 text-neutral-500" />
                </button>
                <div className="text-neutral-900 text-sm">
                  Need some help or want to speak to someone?
                </div>
                <div 
                  className="absolute -bottom-2 right-4 w-3 h-3 bg-white transform rotate-45"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <h3 className="font-medium text-neutral-900">Chat with DigitalDingo</h3>
              <button 
                onClick={handleClose} 
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-black text-white ml-auto'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 p-3 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-2 bg-black text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-black transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 