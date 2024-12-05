'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Timestamp } from 'firebase/firestore'
import { getDateFromTimestamp } from '@/lib/utils/dates'
import { useContacts } from '@/lib/hooks/useContacts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Contact, Note } from '@/lib/types'

// Separate the contact card into its own component
const ContactCard = ({ contact, isSelected, onClick }: {
  contact: Contact
  isSelected: boolean
  onClick: () => void
}) => {
  const formattedDate = useMemo(() => {
    return getDateFromTimestamp(contact.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [contact.createdAt])

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full p-6 bg-white border rounded-xl text-left
        hover:border-primary-ochre hover:shadow-sm transition-all
        ${isSelected ? 'border-primary-ochre ring-1 ring-primary-ochre' : 'border-neutral-200'}`}
      onClick={onClick}
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
        {formattedDate}
      </div>
    </motion.button>
  )
}

// Dynamically import the contact details component
const ContactDetails = dynamic(() => import('./ContactDetails'), {
  loading: () => (
    <div className="lg:col-span-8 flex items-center justify-center p-8 bg-white rounded-xl border border-neutral-200">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  )
})

const queryClient = new QueryClient()

// Wrap the main component with QueryClientProvider
function ContactsPageContent() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const { data: contacts = [], isLoading, error } = useContacts()

  // Memoize sorted contacts
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0
      const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0
      return bTime - aTime
    })
  }, [contacts])

  if (isLoading) {
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
          <p className="text-red-500 mb-4">{error instanceof Error ? error.message : 'An error occurred'}</p>
          <Link href="/admin" className="text-blue-500 hover:underline">
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
          <AnimatePresence>
            {sortedContacts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 bg-white rounded-xl border border-neutral-200"
              >
                <MessageSquare className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-600">No contact submissions yet</p>
              </motion.div>
            ) : (
              sortedContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => setSelectedContact(contact)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Contact Details */}
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <ContactDetails
              key={selectedContact.id}
              contact={selectedContact}
              onUpdate={(updatedContact) => {
                setSelectedContact(updatedContact)
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:block lg:col-span-8 text-center p-8 bg-white rounded-xl border border-neutral-200"
            >
              <p className="text-neutral-500">Select a contact to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Export the wrapped component
export default function ContactsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContactsPageContent />
    </QueryClientProvider>
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