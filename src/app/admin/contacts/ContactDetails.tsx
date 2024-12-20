'use client'

import { useState } from 'react'
import { useUpdateContactStatus } from '@/lib/hooks/useContacts'
import type { Contact } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'

interface Props {
  contact: Contact
  onClose: () => void
  onUpdate: (contact: Contact) => void
}

export function ContactDetails({ contact, onClose, onUpdate }: Props) {
  const updateStatus = useUpdateContactStatus()

  const handleStatusChange = async (status: Contact['status']) => {
    await updateStatus.mutateAsync({ 
      contactId: contact.id, 
      status 
    })
    onUpdate({ ...contact, status })
  }

  return (
    <div className="space-y-6">
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
        <h3 className="font-medium mb-2">Status</h3>
        <select
          value={contact.status}
          onChange={(e) => handleStatusChange(e.target.value as Contact['status'])}
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-ochre"
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
} 