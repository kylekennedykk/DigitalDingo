'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Trash2, Loader2 } from 'lucide-react'
import { getDateFromTimestamp } from '@/lib/utils/dates'
import { useUpdateContactStatus } from '@/lib/hooks/useContacts'
import type { Contact } from '@/lib/types'
import { getAuth } from 'firebase/auth'
import { toast } from 'react-hot-toast'

interface Props {
  contact: Contact
  onUpdate: (contact: Contact) => void
}

function formatTimestamp(timestamp: any) {
  try {
    // Handle admin SDK Timestamp with underscore prefix
    if (timestamp?._seconds && timestamp?._nanoseconds) {
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
      return format(date, 'PPp')
    }
    
    // Handle client SDK Timestamp
    if (timestamp?.toDate) {
      return format(timestamp.toDate(), 'PPp')
    }
    
    // Handle ISO string
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'PPp')
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return format(timestamp, 'PPp')
    }
    
    return 'Invalid date'
  } catch (error) {
    return 'Invalid date'
  }
}

export default function ContactDetails({ contact, onUpdate }: Props) {
  const [note, setNote] = useState('')
  const updateStatus = useUpdateContactStatus()

  useEffect(() => {
    const auth = getAuth()
    console.log('Initial auth state:', {
      isAuthenticated: !!auth.currentUser,
      email: auth.currentUser?.email,
      uid: auth.currentUser?.uid
    })

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', {
        isAuthenticated: !!user,
        email: user?.email,
        uid: user?.uid
      })
    })

    return () => unsubscribe()
  }, [])

  const updateContactStatus = async (status: Contact['status']) => {
    try {
      const updatedContact = await updateStatus.mutateAsync({ 
        contactId: contact.id, 
        status 
      })
      onUpdate(updatedContact)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const addNote = async (content: string) => {
    if (!content.trim()) return

    try {
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (!currentUser) {
        toast.error('You must be logged in to add notes')
        return
      }

      const token = await currentUser.getIdToken(true)
      const url = `/api/admin/contacts/${contact.id}/add-note`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
        credentials: 'include'
      })

      const responseText = await response.text()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed: ' + responseText)
          return
        }
        throw new Error(`Failed to add note: ${responseText}`)
      }

      const updatedContact = JSON.parse(responseText)
      onUpdate(updatedContact)
      setNote('')
      toast.success('Note added successfully')
    } catch (error) {
      toast.error('Failed to add note. Please try again.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNote(note)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete note')

      const updatedContact = await response.json()
      onUpdate(updatedContact)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="lg:col-span-8 bg-white p-8 rounded-xl border border-neutral-200 h-fit sticky top-24"
    >
      <div className="mb-6">
        <h2 className="font-heading text-2xl mb-2">{contact.name}</h2>
        <p className="text-neutral-600">{contact.email}</p>
        {contact.phone && (
          <p className="text-neutral-600">{contact.phone}</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Status</h3>
        <div className="flex gap-2">
          {(['new', 'in-progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => updateContactStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors
                ${contact.status === status
                  ? 'bg-primary-ochre text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                } disabled:opacity-50`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Message</h3>
        <div className="bg-neutral-50 p-4 rounded-lg whitespace-pre-wrap">
          {contact.message}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Notes</h3>
        <div className="space-y-4 mb-4">
          {contact.notes?.map((note) => (
            <div key={note.id} className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm mb-2">{note.content}</div>
              <div className="text-xs text-neutral-500 flex justify-between items-center">
                <span>{formatTimestamp(note.timestamp)}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note..."
            className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-ochre"
          />
          <button
            onClick={() => addNote(note)}
            className="px-4 py-2 bg-primary-ochre text-white rounded-lg"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Additional Information</h3>
        <div className="space-y-2 text-sm text-neutral-600">
          {contact.metadata ? (
            <>
              <p>Time: {new Date(contact.metadata.timestamp).toLocaleString()}</p>
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
            </>
          ) : (
            <p className="text-neutral-500">No additional information available</p>
          )}
        </div>
      </div>
    </motion.div>
  )
} 