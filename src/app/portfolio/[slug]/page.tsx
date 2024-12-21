'use client'

import { useExternalPortfolioItems } from '@/lib/hooks/useExternalPortfolioItems'
import Image from 'next/image'
import type { ExternalPortfolioItem } from '@/types/portfolio'

interface PageProps {
  params: {
    slug: string
  }
}

export default function PortfolioItemPage({ params }: PageProps) {
  const { data: sites = [], isLoading } = useExternalPortfolioItems()
  const site = sites.find(s => s.id === params.slug)

  if (isLoading) return <div>Loading...</div>
  if (!site) return <div>Site not found</div>

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{site.name}</h1>
        {site.thumbnail && (
          <div className="relative aspect-video mb-6">
            <Image
              src={site.thumbnail}
              alt={site.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <p className="text-lg mb-6">{site.description}</p>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Visit Site
        </a>
      </div>
    </div>
  )
} 