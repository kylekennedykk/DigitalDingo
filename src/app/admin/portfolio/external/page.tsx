'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import type { ExternalPortfolioItem } from '@/types/portfolio'
import Image from 'next/image'
import ImageUpload from '../components/ImageUpload'

export default function ExternalPortfolioPage() {
  const [items, setItems] = useState<ExternalPortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState<ExternalPortfolioItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/portfolio/external', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch items')
      const data = await response.json()
      setItems(data.items)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl">External Portfolio</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full
            hover:bg-blue-600 transition-colors"
        >
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-4 space-y-4">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setEditingItem(item)}
              className={`w-full p-6 bg-white border rounded-xl text-left
                hover:border-primary-ochre hover:shadow-sm transition-all
                ${editingItem?.id === item.id ? 'border-primary-ochre ring-1 ring-primary-ochre' : 'border-neutral-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full
                  ${item.published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.published ? 'Published' : 'Draft'}
                </span>
              </div>
              {item.description && (
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600
                        rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-8">
          {(editingItem || isCreating) ? (
            <div className="bg-white p-8 rounded-xl border border-neutral-200">
              <h2 className="font-heading text-2xl mb-8">
                {isCreating ? 'Add External Project' : 'Edit Project'}
              </h2>
              <ExternalItemEditor
                item={isCreating ? null : editingItem}
                onSave={() => {
                  fetchItems()
                  setEditingItem(null)
                  setIsCreating(false)
                }}
                onCancel={() => {
                  setEditingItem(null)
                  setIsCreating(false)
                }}
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-neutral-200">
              <p className="text-neutral-500">Select an item to edit or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExternalItemEditor({
  item,
  onSave,
  onCancel
}: {
  item: ExternalPortfolioItem | null
  onSave: () => void
  onCancel: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(item?.name || '')
  const [description, setDescription] = useState(item?.description || '')
  const [url, setUrl] = useState(item?.url || '')
  const [thumbnail, setThumbnail] = useState(item?.thumbnail || '')
  const [tags, setTags] = useState(item?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [published, setPublished] = useState(item?.published || false)
  const [featured, setFeatured] = useState(item?.featured || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/portfolio/external${item ? `/${item.id}` : ''}`, {
        method: item ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          url,
          thumbnail,
          tags,
          published,
          featured
        }),
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to save item')
      onSave()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded-full
            hover:bg-blue-600 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  )
} 