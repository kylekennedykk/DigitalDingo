'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ImageUpload } from '@/components/ImageUpload'
import { Trash2, Loader2 } from 'lucide-react'

interface ExternalPortfolioItem {
  id: string
  name: string
  description: string
  url: string
  thumbnail?: string
  tags: string[]
  published: boolean
  featured?: boolean
}

interface ExternalPortfolioFormProps {
  project?: ExternalPortfolioItem
  onCancel: () => void
  onSaveComplete: () => void
}

// Add loading skeleton
function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-40 bg-gray-200 rounded" />
    </div>
  )
}

export function ExternalPortfolioForm({ project, onCancel, onSaveComplete }: ExternalPortfolioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ExternalPortfolioItem>>(
    project || {
      name: '',
      description: '',
      url: '',
      thumbnail: '',
      tags: [],
      published: false,
      featured: false
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (project?.id) {
        const docRef = doc(db, 'portfolio-external', project.id)
        await updateDoc(docRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        })
      } else {
        const collectionRef = collection(db, 'portfolio-external')
        await addDoc(collectionRef, {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }

      onSaveComplete()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleImageDelete = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: ''
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Project URL
        </label>
        <input
          type="url"
          id="url"
          value={formData.url}
          onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
        {formData.thumbnail ? (
          <div className="relative">
            <ImageUpload
              currentImage={formData.thumbnail}
              onUpload={url => setFormData(prev => ({ ...prev, thumbnail: url }))}
              folder="portfolio-thumbnails"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <ImageUpload
            currentImage={formData.thumbnail}
            onUpload={url => setFormData(prev => ({ ...prev, thumbnail: url }))}
            folder="portfolio-thumbnails"
          />
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (Press Enter to add)
        </label>
        <input
          type="text"
          id="tags"
          onKeyDown={handleTagInput}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags?.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  )
} 