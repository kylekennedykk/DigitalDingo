'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Layers, 
  Trash2, 
  Plus,
  ChevronUp,
  ChevronDown,
  Edit3,
  Eye,
  Globe,
  LayoutGrid,
  FileText,
  Image,
  Coffee,
  Star,
  Users,
  Clock,
  MapPin,
  DollarSign,
  List,
  Mail,
  HelpCircle,
  Loader2,
  Save
} from 'lucide-react'
import type { PortfolioSite, Section } from '@/types/portfolio'
import SectionEditor from './SectionEditor'
import SectionPreview from './SectionPreview'
import { themes } from '@/lib/themes'

type Tab = 'settings' | 'sections'

export default function SiteEditor({ 
  site, 
  onUpdate 
}: { 
  site: PortfolioSite
  onUpdate: () => void
}) {
  const [activeTab, setActiveTab] = useState<Tab>('sections')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sections, setSections] = useState<Section[]>(site.sections || [])
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [previewSection, setPreviewSection] = useState<Section | null>(null)

  const updateSite = async (data: Partial<PortfolioSite>) => {
    setSaving(true)
    setError('')
    
    try {
      const response = await fetch(`/api/admin/portfolio/${site.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to update site')
      }

      onUpdate()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update site')
    } finally {
      setSaving(false)
    }
  }

  const deleteSite = async () => {
    if (!confirm('Are you sure you want to delete this site?')) return

    try {
      const response = await fetch(`/api/admin/portfolio/${site.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete site')
      }

      onUpdate()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete site')
    }
  }

  const addSection = async (type: Section['type']) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${site.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add section')
      }

      // Add the new section to the local state
      setSections(prevSections => [...prevSections, data])

    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add section')
    }
  }

  const moveSection = async (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id)
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newSections = [...sections]
    const [section] = newSections.splice(index, 1)
    newSections.splice(newIndex, 0, section)

    // Update order numbers
    const updatedSections = newSections.map((s, i) => ({ ...s, order: i }))
    setSections(updatedSections)

    try {
      await Promise.all(
        updatedSections.map(section =>
          fetch(`/api/admin/portfolio/${site.id}/sections/${section.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: section.order }),
            credentials: 'include'
          })
        )
      )

      onUpdate()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const sectionTypes = [
    {
      type: 'hero',
      icon: LayoutGrid,
      description: 'Add a hero banner section'
    },
    {
      type: 'content',
      icon: FileText,
      description: 'Add a content section with text and images'
    },
    {
      type: 'gallery',
      icon: Image,
      description: 'Add an image gallery'
    },
    {
      type: 'menu',
      icon: Coffee,
      description: 'Add a menu section with items and prices'
    },
    {
      type: 'testimonials',
      icon: Star,
      description: 'Add customer testimonials'
    },
    {
      type: 'team',
      icon: Users,
      description: 'Add team member profiles'
    },
    {
      type: 'hours',
      icon: Clock,
      description: 'Add business hours'
    },
    {
      type: 'location',
      icon: MapPin,
      description: 'Add location and map'
    },
    {
      type: 'services',
      icon: List,
      description: 'Add a list of services'
    },
    {
      type: 'pricing',
      icon: DollarSign,
      description: 'Add pricing tables'
    },
    {
      type: 'contact',
      icon: Mail,
      description: 'Add a contact form'
    },
    {
      type: 'faq',
      icon: HelpCircle,
      description: 'Add frequently asked questions'
    }
  ] as const

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-heading text-2xl mb-2">{site.name}</h2>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{sections.length} sections</span>
            </div>
            {site.status === 'published' && (
              <a
                href={`/portfolio/${site.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-neutral-900"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </a>
            )}
          </div>
        </div>
        <button
          onClick={deleteSite}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Site"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${activeTab === 'settings' 
              ? 'bg-white text-neutral-900 shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
            }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${activeTab === 'sections' 
              ? 'bg-white text-neutral-900 shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
            }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sections</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'settings' ? (
        <SiteSettings site={site} onUpdate={updateSite} saving={saving} />
      ) : (
        <div className="space-y-6">
          {/* Section List */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium capitalize">{section.type}</h4>
                  {section.content.title && (
                    <p className="text-sm text-neutral-600">{section.content.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-neutral-500 hover:text-neutral-900
                      disabled:opacity-50 disabled:hover:text-neutral-500"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-2 text-neutral-500 hover:text-neutral-900
                      disabled:opacity-50 disabled:hover:text-neutral-900"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewSection(section)}
                    className="p-2 text-neutral-500 hover:text-neutral-900"
                    title="Preview section"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingSection(section)}
                    className="p-2 text-neutral-500 hover:text-neutral-900"
                    title="Edit section"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Section */}
          <div>
            <h3 className="font-medium mb-4">Add New Section</h3>
            <div className="grid grid-cols-2 gap-4">
              {sectionTypes.map(({ type, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="p-4 bg-white border border-neutral-200 rounded-lg
                    hover:border-primary-ochre hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-5 h-5 text-neutral-500" />
                    <span className="font-medium capitalize">{type}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          siteId={site.id}
          onClose={() => setEditingSection(null)}
          onUpdate={() => {
            onUpdate()
            setEditingSection(null)
          }}
        />
      )}

      {previewSection && (
        <SectionPreview
          section={previewSection}
          siteTheme={site.theme}
          themeOverrides={site.settings.theme}
          onClose={() => setPreviewSection(null)}
        />
      )}
    </div>
  )
}

function SiteSettings({
  site,
  onUpdate,
  saving
}: {
  site: PortfolioSite
  onUpdate: (data: Partial<PortfolioSite>) => Promise<void>
  saving: boolean
}) {
  const [name, setName] = useState(site.name)
  const [slug, setSlug] = useState(site.slug)
  const [status, setStatus] = useState(site.status)
  const [selectedTheme, setSelectedTheme] = useState(site.theme || 'default')

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!slug || slug === generateSlug(site.name)) {
      setSlug(generateSlug(newName))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate({ name, status, theme: selectedTheme })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="font-medium text-lg">Basic Settings</h3>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg
              focus:ring-2 focus:ring-primary-ochre focus:border-transparent
              transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">/portfolio/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg
                focus:ring-2 focus:ring-primary-ochre focus:border-transparent
                transition-all"
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens are allowed"
            />
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            This will be the URL of your site: digitaldingo.uk/portfolio/{slug}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PortfolioSite['status'])}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg
              focus:ring-2 focus:ring-primary-ochre focus:border-transparent
              transition-all"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-medium text-lg">Theme Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedTheme(theme.id)}
              className={`p-4 border rounded-xl text-left transition-all
                ${selectedTheme === theme.id 
                  ? 'border-primary-ochre ring-1 ring-primary-ochre' 
                  : 'border-neutral-200 hover:border-primary-ochre'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                <span className="font-medium">{theme.name}</span>
              </div>
              <div className="text-sm text-neutral-600">
                <div>Heading: {theme.fonts.heading}</div>
                <div>Body: {theme.fonts.body}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full px-4 py-2 bg-primary-ochre text-white rounded-lg
          hover:bg-primary-ochre/90 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </form>
  )
} 