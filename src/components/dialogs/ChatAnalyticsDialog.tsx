'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X } from 'lucide-react'
import { LocationMap } from '@/components/maps/LocationMap'

// Define our custom message type
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatAnalyticsDialogProps {
  chat: {
    id: string
    data: {
      userName?: string
      status: string
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
          latitude?: number
          longitude?: number
        }
      }
      messages: ChatMessage[]
    }
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// First add the helper function at the top
function formatDuration(start: Date, end: Date): string {
  const diff = Math.floor((end.getTime() - start.getTime()) / 1000) // in seconds
  
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)
  
  return parts.join(' ')
}

export function ChatAnalyticsDialog({ 
  chat, 
  open, 
  onOpenChange 
}: ChatAnalyticsDialogProps) {
  if (!chat || !chat.data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Chat with {chat.data.userName || 'Anonymous'}
          </DialogTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left column - Chat messages */}
          <div className="w-2/5 border-r">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {chat.data.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-black text-white'
                          : 'bg-neutral-100'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right column - Analytics */}
          <div className="w-3/5 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Session Info */}
                <div className="space-y-2">
                  <h3 className="font-medium">Session Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Started:</span>
                      <span className="ml-2">
                        {new Date(chat.data.metadata.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Ended:</span>
                      <span className="ml-2">
                        {chat.data.metadata.endTime 
                          ? new Date(chat.data.metadata.endTime).toLocaleString()
                          : 'Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Duration:</span>
                      <span className="ml-2">
                        {formatDuration(
                          new Date(chat.data.metadata.startTime),
                          chat.data.metadata.endTime ? new Date(chat.data.metadata.endTime) : new Date()
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        chat.data.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100'
                      }`}>
                        {chat.data.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="space-y-2">
                  <h3 className="font-medium">Location</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500">City:</span>
                        <span className="ml-2">{chat.data.metadata.location?.city || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Region:</span>
                        <span className="ml-2">{chat.data.metadata.location?.region || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Country:</span>
                        <span className="ml-2">{chat.data.metadata.location?.country || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">IP Address:</span>
                        <span className="ml-2">{chat.data.metadata.location?.ip || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Timezone:</span>
                        <span className="ml-2">{chat.data.metadata.location?.timezone || 'Unknown'}</span>
                      </div>
                      {chat.data.metadata.location?.latitude && (
                        <div>
                          <span className="text-neutral-500">Coordinates:</span>
                          <span className="ml-2">
                            {chat.data.metadata.location.latitude.toFixed(6)}, 
                            {chat.data.metadata.location.longitude?.toFixed(6)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {chat.data.metadata.location?.latitude && chat.data.metadata.location?.longitude && (
                      <LocationMap
                        latitude={chat.data.metadata.location.latitude}
                        longitude={chat.data.metadata.location.longitude}
                        city={chat.data.metadata.location.city}
                        country={chat.data.metadata.location.country}
                      />
                    )}
                  </div>
                </div>

                {/* System Info */}
                <div className="space-y-2">
                  <h3 className="font-medium">System Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Browser:</span>
                      <span className="ml-2">{chat.data.metadata.userAgent}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Platform:</span>
                      <span className="ml-2">{chat.data.metadata.platform}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Screen:</span>
                      <span className="ml-2">{chat.data.metadata.screenResolution}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Language:</span>
                      <span className="ml-2">{chat.data.metadata.language}</span>
                    </div>
                  </div>
                </div>

                {/* Chat Statistics */}
                <div className="space-y-2">
                  <h3 className="font-medium">Chat Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Total Messages:</span>
                      <span className="ml-2">{chat.data.messages.length}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">User Messages:</span>
                      <span className="ml-2">
                        {chat.data.messages.filter(m => m.role === 'user').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Assistant Messages:</span>
                      <span className="ml-2">
                        {chat.data.messages.filter(m => m.role === 'assistant').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Words Exchanged:</span>
                      <span className="ml-2">
                        {chat.data.messages.reduce((acc, msg) => 
                          acc + msg.content.split(/\s+/).length, 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 