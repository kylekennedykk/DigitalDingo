'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, MessageSquare, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

interface Note {
  id: string
  content: string
  timestamp: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'in-progress' | 'completed'
  createdAt: Timestamp
  lastUpdated: Timestamp
  notes: Note[]
  source?: string
  metadata?: {
    timestamp: number
    userAgent: string
    language: string
    screenResolution: string
    timezone: string
    platform: string
    referrer: string
    location?: {
      country?: string
      region?: string
      city?: string
    }
  }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [note, setNote] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/contacts', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      
      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('ContactsPage mounted')
    fetchContacts()
  }, [fetchContacts])

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    setUpdateLoading(true)
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, status } : null)
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      setError('Failed to update contact status')
    } finally {
      setUpdateLoading(false)
    }
  }

  const addNote = async (id: string, content: string) => {
    if (!content.trim()) return

    setUpdateLoading(true)
    try {
      console.log('Sending note:', { id, content })
      
      const response = await fetch(`/api/admin/contacts/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log('Response from notes API:', {
        status: response.status,
        data
      })
      
      if (!response.ok) {
        console.error('Failed to add note:', {
          status: response.status,
          data
        })
        
        if (response.status === 401) {
          window.location.href = '/admin'
          return
        }
        
        throw new Error(data.error || data.details || 'Failed to add note')
      }

      console.log('Note added successfully:', data)
      setSelectedContact(data)
      setContacts(prevContacts => 
        prevContacts.map(c => 
          c.id === id ? data : c
        )
      )
      setNote('')
    } catch (error) {
      console.error('Error adding note:', error)
      setError(error instanceof Error ? error.message : 'Failed to add note')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && selectedContact) {
      e.preventDefault()
      await addNote(selectedContact.id, note)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedContact || !confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact.id}/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete note')

      const updatedContact = await response.json()
      setSelectedContact(updatedContact)
      setContacts(prev => 
        prev.map(contact => 
          contact.id === selectedContact.id ? updatedContact : contact
        )
      )
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link 
            href="/admin"
            className="text-blue-500 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl">Contact Submissions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact List */}
        <div className="lg:col-span-4 space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
              <MessageSquare className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600">No contact submissions yet</p>
            </div>
          ) : (
            contacts.map(contact => (
              <motion.button
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full p-6 bg-white border rounded-xl text-left
                  hover:border-primary-ochre hover:shadow-sm transition-all
                  ${selectedContact?.id === contact.id ? 'border-primary-ochre ring-1 ring-primary-ochre' : 'border-neutral-200'}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{contact.name}</h3>
                    <p className="text-neutral-600">{contact.email}</p>
                    {contact.phone && (
                      <p className="text-neutral-500 text-sm">{contact.phone}</p>
                    )}
                  </div>
                  <StatusBadge status={contact.status} />
                </div>
                <p className="text-neutral-700 line-clamp-2">{contact.message}</p>
                <div className="mt-4 text-sm text-neutral-500">
                  {new Date(contact.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Contact Details */}
        {selectedContact ? (
          <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-neutral-200 h-fit sticky top-24">
            <div className="mb-6">
              <h2 className="font-heading text-2xl mb-2">{selectedContact.name}</h2>
              <p className="text-neutral-600">{selectedContact.email}</p>
              {selectedContact.phone && (
                <p className="text-neutral-600">{selectedContact.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Status</h3>
              <div className="flex gap-2">
                {(['new', 'in-progress', 'completed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => updateContactStatus(selectedContact.id, status)}
                    disabled={updateLoading}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors
                      ${selectedContact.status === status
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
                {selectedContact.message}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Notes</h3>
              <div className="space-y-4">
                {selectedContact.notes?.map((note) => (
                  <div key={note.id} className="bg-neutral-50 p-4 rounded-lg">
                    <div className="text-sm mb-2">{note.content}</div>
                    <div className="text-xs text-neutral-500 flex justify-between items-center">
                      <span>{format(new Date(note.timestamp), 'PPp')}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) || <p className="text-neutral-500 text-sm">No notes yet</p>}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Additional Information</h3>
              <div className="space-y-2 text-sm text-neutral-600">
                {selectedContact.metadata ? (
                  <>
                    <p>Time: {new Date(selectedContact.metadata.timestamp).toLocaleString()}</p>
                    {selectedContact.metadata.location && (
                      <p>
                        Location: {[
                          selectedContact.metadata.location.city,
                          selectedContact.metadata.location.region,
                          selectedContact.metadata.location.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p>Browser: {selectedContact.metadata.userAgent}</p>
                    <p>Screen: {selectedContact.metadata.screenResolution}</p>
                    <p>Platform: {selectedContact.metadata.platform}</p>
                    <p>Referrer: {selectedContact.metadata.referrer || 'Direct'}</p>
                  </>
                ) : (
                  <p className="text-neutral-500">No additional information available</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:block lg:col-span-8 text-center p-8 bg-white rounded-xl border border-neutral-200">
            <p className="text-neutral-500">Select a contact to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Contact['status'] }) {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
} 