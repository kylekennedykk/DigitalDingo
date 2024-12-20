import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Contact } from '@/lib/types'

export function useContacts() {
  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await fetch('/api/admin/contacts', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      return data.contacts
    }
  })
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      contactId, 
      status 
    }: { 
      contactId: string
      status: Contact['status']
    }) => {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (contactId: string) => {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
} 