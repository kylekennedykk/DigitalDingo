'use client'

import { useState } from 'react'
import { useContacts } from '@/lib/hooks/useContacts'
import { ContactCard } from './ContactCard'
import { LoadingSpinner } from '@/components/ui/loading-states'
import type { Contact } from '@/lib/types'

export default function ContactsPage() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const { data: contacts, isLoading, error } = useContacts()

  const handleContactUpdate = (updatedContact: Contact) => {
    // Update the contacts list with the updated contact
    const updatedContacts = contacts?.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    )
    
    // Force a refetch to ensure we have the latest data
    queryClient.setQueryData(['contacts'], updatedContacts)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error loading contacts</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {contacts?.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          isSelected={contact.id === selectedContactId}
          onClick={() => setSelectedContactId(contact.id)}
          onDelete={() => setSelectedContactId(null)}
          onUpdate={handleContactUpdate}
        />
      ))}
      {contacts?.length === 0 && (
        <div className="col-span-full text-center py-8 text-neutral-500">
          No contacts found
        </div>
      )}
    </div>
  )
} 