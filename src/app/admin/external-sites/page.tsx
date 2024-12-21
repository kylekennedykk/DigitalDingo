'use client'

import { useState } from 'react'
import { useExternalPortfolioItems } from '@/lib/hooks/useExternalPortfolioItems'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ExternalPortfolioItem } from '@/types/portfolio'

export default function ExternalSitesPage() {
  const { data: sites = [], isLoading } = useExternalPortfolioItems()
  const [selectedSite, setSelectedSite] = useState<ExternalPortfolioItem | null>(null)

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">External Sites</h1>
      
      <div className="grid gap-4">
        {sites.map(site => (
          <div key={site.id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{site.name}</h2>
            <p className="text-gray-600 mt-2">{site.description}</p>
            <div className="mt-4">
              <a 
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Visit Site
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 