'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ImageUpload'
import { TeamMember, TeamMemberFormProps } from '../types'

export function TeamMemberForm({ member, onSave, onCancel }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    photo: member?.photo || '',
    description: member?.description || ''
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave({
          id: member?.id,
          ...formData
        })
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <ImageUpload
          currentImage={formData.photo}
          onUpload={url => setFormData(prev => ({ ...prev, photo: url }))}
          folder="team-photos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <input
          type="text"
          value={formData.role}
          onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  )
} 