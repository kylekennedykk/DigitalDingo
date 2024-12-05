'use client'

import { useState, useEffect } from 'react'
import { Plus, Globe } from 'lucide-react'
import type { PortfolioSite } from '@/types/portfolio'
import SiteEditor from './components/SiteEditor'

export default function PortfolioPage() {
  const [sites, setSites] = useState<PortfolioSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingSite, setEditingSite] = useState<PortfolioSite | null>(null)

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/admin/portfolio', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch sites')
      const data = await response.json()
      setSites(data.sites || [])
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch sites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  const createSite = async () => {
    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Site',
          slug: 'new-site',
          status: 'draft',
          sections: []
        }),
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to create site')
      
      const site = await response.json()
      setEditingSite(site)
      await fetchSites()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create site')
    }
  }

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
        <h1 className="font-heading text-3xl">Portfolio Sites</h1>
        <button
          onClick={createSite}
          className="px-4 py-2 bg-blue-500 text-white rounded-full
            hover:bg-blue-600 transition-colors"
        >
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sites List */}
        <div className="lg:col-span-4 space-y-4">
          {Array.isArray(sites) && sites.map(site => (
            <button
              key={site.id}
              onClick={() => setEditingSite(site)}
              className={`w-full p-6 bg-white border rounded-xl text-left
                hover:border-primary-ochre hover:shadow-sm transition-all
                ${editingSite?.id === site.id ? 'border-primary-ochre ring-1 ring-primary-ochre' : 'border-neutral-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-heading text-xl">{site.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-full capitalize
                  ${site.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{site.sections?.length || 0} sections</span>
                </div>
                {site.status === 'published' && (
                  <a
                    href={`/portfolio/${site.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                    onClick={e => e.stopPropagation()}
                  >
                    View Site
                  </a>
                )}
              </div>
            </button>
          ))}

          {(!sites || sites.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 text-neutral-500">
              No sites yet. Click the button above to create one.
            </div>
          )}
        </div>

        {/* Site Editor */}
        <div className="lg:col-span-8">
          {editingSite ? (
            <SiteEditor site={editingSite} onUpdate={() => {
              setEditingSite(null)
              fetchSites()
            }} />
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-neutral-200">
              <p className="text-neutral-500">Select a site to edit or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 