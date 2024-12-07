'use client'

import { motion, Variants } from 'framer-motion'
import { usePortfolioItems } from '@/lib/hooks/usePortfolioItems'
import { ImageWithFallback } from './ImageWithFallback'
import { Loader2, RefreshCw } from 'lucide-react'

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

export function LatestProjects() {
  const { 
    data: items = [],
    isLoading, 
    error, 
    refetch 
  } = usePortfolioItems(3)

  if (isLoading) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'Failed to load portfolio items'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            No portfolio items available
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Latest Projects
        </motion.h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
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
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 