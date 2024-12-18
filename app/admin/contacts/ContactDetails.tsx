'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { useUpdateContactStatus, useAddNote } from '@/lib/hooks/useContacts'
import type { Contact } from '@/lib/types'
import { format, parseISO, fromUnixTime } from 'date-fns'

interface Props {
  contact: Contact
  onClose: () => void
  onUpdate: (contact: Contact) => void
}

export function ContactDetails({ contact, onClose, onUpdate }: Props) {
  const [note, setNote] = useState('')
  const updateStatus = useUpdateContactStatus()
  const addNote = useAddNote()

  const handleStatusChange = async (newStatus: Contact['status']) => {
    if (newStatus === contact.status) return // Don't update if status hasn't changed
    
    try {
      const response = await updateStatus.mutateAsync({ 
        contactId: contact.id, 
        status: newStatus 
      })
      
      // Update the local state with the response from the server
      if (response) {
        onUpdate({
          ...contact,
          ...response,
          status: newStatus
        })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return

    try {
      const updatedContact = await addNote.mutateAsync({
        contactId: contact.id,
        content: note.trim()
      })
      onUpdate(updatedContact)
      setNote('')
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  const formatDate = (date: any) => {
    try {
      // If it's a Firestore Timestamp (has _seconds and _nanoseconds)
      if (date && typeof date === 'object' && ('_seconds' in date || 'seconds' in date)) {
        const seconds = date._seconds || date.seconds
        return format(new Date(seconds * 1000), 'PPpp')
      }
      
      // If it's a string that might be an ISO date
      if (typeof date === 'string') {
        if (date.includes('T')) {
          return format(parseISO(date), 'PPpp')
        }
        // If it's a timestamp string
        return format(new Date(parseInt(date)), 'PPpp')
      }
      
      // If it's a number (unix timestamp)
      if (typeof date === 'number') {
        // Check if it's seconds (Firestore) or milliseconds
        const timestamp = date > 9999999999 ? date : date * 1000
        return format(new Date(timestamp), 'PPpp')
      }

      // If it's a Date object
      if (date instanceof Date) {
        return format(date, 'PPpp')
      }

      throw new Error('Unsupported date format')
    } catch (error) {
      console.error('Date formatting error:', error, 'Value:', date)
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Contact Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Status</h3>
          <div className="flex gap-2">
            {(['new', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updateStatus.isPending || status === contact.status}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  contact.status === status
                    ? 'bg-primary-ochre text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status === contact.status && updateStatus.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  status
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Contact Information</h3>
          <div className="space-y-2">
            <p><span className="text-neutral-500">Name:</span> {contact.name}</p>
            <p><span className="text-neutral-500">Email:</span> {contact.email}</p>
            {contact.phone && (
              <p><span className="text-neutral-500">Phone:</span> {contact.phone}</p>
            )}
            {contact.timestamp && (
              <p><span className="text-neutral-500">Submitted:</span> {formatDate(contact.timestamp)}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Message</h3>
          <p className="text-neutral-700 whitespace-pre-wrap">{contact.message}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Notes</h3>
          <form onSubmit={handleAddNote} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-ochre"
              />
              <button
                type="submit"
                disabled={!note.trim() || addNote.isPending}
                className="px-4 py-2 bg-primary-ochre text-white rounded-lg hover:bg-primary-ochre/90 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {contact.notes && contact.notes.length > 0 ? (
              contact.notes.map(note => (
                <div key={note.id} className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-sm mb-1">{note.content}</p>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>
                      {note.timestamp ? 
                        formatDate(note.timestamp) : 
                        'No date'
                      }
                    </span>
                    {note.author && <span>{note.author.name || note.author.email}</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No notes yet</p>
            )}
          </div>
        </div>

        {contact.metadata && (
          <div>
            <h3 className="font-medium mb-2">Additional Information</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>Time: {formatDate(contact.metadata.timestamp)}</p>
              {contact.metadata.location && (
                <p>
                  Location: {[
                    contact.metadata.location.city,
                    contact.metadata.location.region,
                    contact.metadata.location.country
                  ].filter(Boolean).join(', ')}
                </p>
              )}
              <p>Browser: {contact.metadata.userAgent}</p>
              <p>Screen: {contact.metadata.screenResolution}</p>
              <p>Platform: {contact.metadata.platform}</p>
              <p>Referrer: {contact.metadata.referrer || 'Direct'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 