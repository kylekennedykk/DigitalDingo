'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/firebase'
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore'
import { Loader2, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { Dialog } from '@headlessui/react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: {
    seconds: number
    nanoseconds: number
  }
}

interface ChatMetadata {
  startTime: string
  endTime?: string
  duration?: string
  userAgent: string
  ipAddress?: string
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

interface Chat {
  id: string
  messages: ChatMessage[]
  metadata: ChatMetadata
  status: 'active' | 'ended'
  isRead: boolean
  createdAt: Timestamp
  userName?: string
}

interface ChatModalProps {
  chat: Chat
  isOpen: boolean
  onClose: () => void
}

function ChatModal({ chat, isOpen, onClose }: ChatModalProps) {
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return ''
    
    // Handle Firestore timestamp
    if (timestamp.seconds) {
      return format(new Date(timestamp.seconds * 1000), 'HH:mm:ss')
    }
    
    // Handle string timestamp
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'HH:mm:ss')
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return format(timestamp, 'HH:mm:ss')
    }

    return ''
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-xl flex">
          {/* Chat Messages */}
          <div className="w-1/2 border-r p-6 overflow-y-auto">
            <h3 className="font-semibold mb-4">Chat History</h3>
            <div className="space-y-4">
              {chat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-50 ml-8'
                      : 'bg-neutral-50 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">
                      {message.role === 'user' ? chat.userName || 'User' : 'Assistant'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="font-semibold mb-4">Chat Analytics</h3>
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Session Info</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-neutral-600">Started</dt>
                    <dd>{format(chat.createdAt.toDate(), 'PPpp')}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-600">Duration</dt>
                    <dd>{chat.metadata.duration || 'Active'}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-600">Status</dt>
                    <dd className="capitalize">{chat.status}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">User Info</h4>
                <dl className="space-y-2 text-sm">
                  {chat.metadata.location && (
                    <div>
                      <dt className="text-neutral-600">Location</dt>
                      <dd>
                        {[
                          chat.metadata.location.city,
                          chat.metadata.location.region,
                          chat.metadata.location.country
                        ].filter(Boolean).join(', ')}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-neutral-600">Device</dt>
                    <dd>{chat.metadata.userAgent}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-600">IP Address</dt>
                    <dd>{chat.metadata.ipAddress || 'Unknown'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default function ChatHistory() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  const fetchChats = async (isInitial = false) => {
    try {
      console.log('Fetching chats...')
      let q = query(
        collection(db, 'chatSessions'),
        orderBy('createdAt', 'desc'),
        limit(10)
      )

      console.log('Executing query...')
      const snapshot = await getDocs(q)
      console.log('Got snapshot, docs count:', snapshot.docs.length)
      
      // Log each document
      snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>, index: number) => {
        console.log(`Document ${index + 1}:`, {
          id: doc.id,
          data: doc.data()
        })
      })

      const newChats = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt as Timestamp
      })) as Chat[]

      console.log('Processed chats:', newChats)

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === 10)

      if (isInitial) {
        setChats(newChats)
      } else {
        setChats(prev => [...prev, ...newChats])
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats(true)
  }, [])

  const markAsRead = async (chatId: string) => {
    try {
      const chatRef = doc(db, 'chatSessions', chatId)
      await updateDoc(chatRef, { isRead: true })
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId ? { ...chat, isRead: true } : chat
        )
      )
    } catch (error) {
      console.error('Error marking chat as read:', error)
    }
  }

  const deleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      await deleteDoc(doc(db, 'chatSessions', chatId))
      setChats(prev => prev.filter(chat => chat.id !== chatId))
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const cleanupOldSessions = async () => {
    if (!confirm('Are you sure you want to delete all chat sessions? This cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'chatSessions'))
      
      const deletePromises = snapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      )
      
      await Promise.all(deletePromises)
      setChats([])
      alert('All chat sessions have been deleted')
    } catch (error) {
      console.error('Error cleaning up sessions:', error)
      alert('Failed to delete all sessions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat History</h1>
        <button
          onClick={cleanupOldSessions}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clean Up All Sessions
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chats.map(chat => (
          <div 
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`bg-white p-6 rounded-lg shadow-sm cursor-pointer 
              hover:shadow-md transition-shadow ${
              !chat.isRead ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">
                  {chat.userName || 'Anonymous User'}
                </h3>
                <p className="text-sm text-neutral-500">
                  {format(chat.createdAt.toDate(), 'PPp')}
                </p>
                {chat.metadata?.location && (
                  <p className="text-sm text-neutral-600">
                    {[
                      chat.metadata.location.city,
                      chat.metadata.location.country
                    ].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!chat.isRead && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
            
            <div className="text-sm text-neutral-600">
              <p>Messages: {chat.messages.length}</p>
              <p>Status: {chat.status}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedChat && (
        <ChatModal
          chat={selectedChat}
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      )}

      {hasMore && (
        <button
          onClick={() => fetchChats()}
          className="w-full py-3 text-center text-neutral-600 hover:bg-neutral-50 rounded-lg"
        >
          Load More
        </button>
      )}
    </div>
  )
} 