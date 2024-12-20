'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, startAfter, getDocs, writeBatch, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Checkbox, Button } from '@/components/ui'
import { Trash2, CheckSquare, Square, RefreshCw } from 'lucide-react'
import { ChatAnalyticsDialog } from '@/components/dialogs/ChatAnalyticsDialog'

interface ChatSession {
  id: string
  data: {
    status: string
    isRead: boolean
    userName?: string
    metadata: {
      startTime: Date
      endTime?: Date
      duration?: string
      userAgent: string
      platform: string
      language: string
      screenResolution: string
      location?: {
        city?: string
        region?: string
        country?: string
        ip?: string
        timezone?: string
      }
    }
    messages: Array<{
      role: 'user' | 'assistant'
      content: string
      timestamp: Date
    }>
  }
}

export default function ChatHistory() {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set())
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null)

  const CHATS_PER_PAGE = 10

  const fetchChats = async (lastDoc?: any) => {
    setLoading(true)
    try {
      const chatsQuery = lastDoc 
        ? query(
            collection(db, 'chatSessions'),
            orderBy('metadata.startTime', 'desc'),
            startAfter(lastDoc),
            limit(CHATS_PER_PAGE)
          )
        : query(
            collection(db, 'chatSessions'),
            orderBy('metadata.startTime', 'desc'),
            limit(CHATS_PER_PAGE)
          )

      const snapshot = await getDocs(chatsQuery)
      const newChats = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })) as ChatSession[]

      if (!lastDoc) {
        setChats(newChats)
      } else {
        setChats(prev => [...prev, ...newChats])
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      setHasMore(snapshot.docs.length === CHATS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  const toggleSelect = (chatId: string) => {
    const newSelected = new Set(selectedChats)
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId)
    } else {
      newSelected.add(chatId)
    }
    setSelectedChats(newSelected)
  }

  const selectAll = () => {
    if (selectedChats.size === chats.length) {
      setSelectedChats(new Set())
    } else {
      setSelectedChats(new Set(chats.map(chat => chat.id)))
    }
  }

  const deleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete the selected chats?')) {
      return
    }

    setLoading(true)
    try {
      const batch = writeBatch(db)
      selectedChats.forEach(chatId => {
        const chatRef = doc(db, 'chatSessions', chatId)
        batch.delete(chatRef)
      })
      await batch.commit()
      
      // Update local state to remove deleted chats
      setChats(prev => prev.filter(chat => !selectedChats.has(chat.id)))
      setSelectedChats(new Set())
    } catch (error) {
      console.error('Error deleting chats:', error)
      alert('Failed to delete chats. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markSelectedAsRead = async () => {
    setLoading(true)
    try {
      const batch = writeBatch(db)
      selectedChats.forEach(chatId => {
        const chatRef = doc(db, 'chatSessions', chatId)
        batch.update(chatRef, { isRead: true })
      })
      await batch.commit()
      
      // Update local state to mark chats as read
      setChats(prev => prev.map(chat => 
        selectedChats.has(chat.id) 
          ? { ...chat, data: { ...chat.data, isRead: true } }
          : chat
      ))
      setSelectedChats(new Set())
    } catch (error) {
      console.error('Error marking chats as read:', error)
      alert('Failed to mark chats as read. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent, chat: ChatSession) => {
    const target = e.target as HTMLElement
    if (
      target.closest('button') || 
      target.closest('input[type="checkbox"]') ||
      target.closest('.checkbox')
    ) {
      return
    }
    setSelectedChat(chat)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Chat History</h1>
        <div className="flex gap-2">
          <Button 
            onClick={selectAll}
            variant="outline"
            className="flex items-center gap-2"
          >
            {selectedChats.size === chats.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {selectedChats.size === chats.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            onClick={deleteSelected}
            variant="default"
            disabled={selectedChats.size === 0 || loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
          <Button
            onClick={markSelectedAsRead}
            disabled={selectedChats.size === 0 || loading}
            className="flex items-center gap-2"
          >
            Mark as Read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {chats.map(chat => (
          <div 
            key={chat.id}
            onClick={(e) => handleCardClick(e, chat)}
            className={`p-4 rounded-lg border ${
              selectedChats.has(chat.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            } hover:border-blue-300 transition-colors cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedChats.has(chat.id)}
                onCheckedChange={() => toggleSelect(chat.id)}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{chat.data.userName || 'Anonymous'}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        {chat.data.metadata.location?.city || 'Unknown Location'}
                        {chat.data.metadata.location?.country && `, ${chat.data.metadata.location.country}`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(chat.data.metadata.startTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!chat.data.isRead && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Unread
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      chat.data.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {chat.data.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Messages: {chat.data.messages.length}
                  {chat.data.metadata.duration && ` • Duration: ${chat.data.metadata.duration}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatAnalyticsDialog 
        chat={selectedChat!}
        open={!!selectedChat}
        onOpenChange={(open) => !open && setSelectedChat(null)}
      />

      {loading && (
        <div className="flex justify-center my-8">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => fetchChats(lastVisible)}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
} 