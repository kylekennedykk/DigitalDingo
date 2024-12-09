'use client'

import { useState } from 'react'
import { Trash2, AlertCircle } from 'lucide-react'
import { useDeleteContact } from '@/lib/hooks/useContacts'
import { Dialog } from '@headlessui/react'
import type { Contact } from '@/lib/types'
import { ContactDetails } from './ContactDetails'

interface ContactCardProps {
  contact: Contact
  isSelected: boolean
  onClick: () => void
  onDelete?: () => void
  onUpdate: (contact: Contact) => void
}

export function ContactCard({ contact, isSelected, onClick, onDelete, onUpdate }: ContactCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const deleteContact = useDeleteContact()

  const getStatusBadgeClasses = (status: Contact['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteContact.mutateAsync(contact.id)
      setShowDeleteDialog(false)
      onDelete?.()
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  return (
    <>
      <div 
        className={`relative p-4 bg-white rounded-lg border cursor-pointer transition-colors
          ${isSelected ? 'border-primary-ochre' : 'border-neutral-200'}
          hover:border-primary-ochre`}
        onClick={() => setShowDetailsDialog(true)}
      >
        <div className="pr-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">{contact.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadgeClasses(contact.status)}`}>
              {contact.status}
            </span>
          </div>
          <div className="text-sm text-neutral-600">
            <p>{contact.email}</p>
            {contact.phone && <p>{contact.phone}</p>}
          </div>
          <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
            {contact.message}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteDialog(true)
          }}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-red-500 
            hover:bg-red-50 rounded-full transition-colors group"
          title="Delete contact"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-2xl h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <ContactDetails 
              contact={contact} 
              onClose={() => setShowDetailsDialog(false)}
              onUpdate={(updatedContact) => {
                onUpdate(updatedContact)
                // Optionally close the dialog after update
                // setShowDetailsDialog(false)
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <Dialog.Title className="text-lg font-medium">
                Delete Contact
              </Dialog.Title>
            </div>
            
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteContact.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                  transition-colors disabled:opacity-50"
              >
                {deleteContact.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 