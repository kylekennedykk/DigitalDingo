'use client'

import { motion } from 'framer-motion'
import { ImageWithFallback } from '@/components/ImageWithFallback'
import { Tag } from '@/components/ui/Tag'

export interface PortfolioCardProps {
  item: {
    id: string
    title: string
    description: string
    imageUrl: string
    tags?: string[]
    url?: string
  }
  variant?: 'default' | 'compact'
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

export function PortfolioCard({ item, variant = 'default' }: PortfolioCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <ImageWithFallback
        src={item.imageUrl}
        alt={item.title}
        width={600}
        height={400}
        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`p-6 ${variant === 'compact' ? 'space-y-2' : 'space-y-4'}`}>
        <h3 className={`font-bold ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
          {item.title}
        </h3>
        <p className="text-gray-600 line-clamp-2">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <Tag key={tag} variant="secondary">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
} 