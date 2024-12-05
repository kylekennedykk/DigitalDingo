'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProjectCardProps {
  item: {
    id: string
    name: string
    slug: string
    description?: string
    thumbnail?: string
    type: 'built' | 'external'
    url?: string
    tags?: string[]
  }
}

export function ProjectCard({ item }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false)
  const fallbackImage = '/images/project-placeholder.jpg'

  return (
    <div className="group h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imageError ? fallbackImage : item.thumbnail || fallbackImage}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={false}
        />
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className="font-heading text-xl mb-2">{item.name}</h3>

        {item.description && (
          <p className="text-neutral-600 mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full bg-neutral-100 text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-grow" />

        <Link
          href={item.type === 'built' ? `/portfolio/${item.slug}` : item.url || '#'}
          className="inline-flex items-center justify-center px-6 py-2 bg-primary-ochre text-white rounded-full hover:bg-primary-ochre/90 transition-colors mt-4"
          {...(item.type === 'external' && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {item.type === 'built' ? 'View Project' : 'Visit Site'}
        </Link>
      </div>
    </div>
  )
} 