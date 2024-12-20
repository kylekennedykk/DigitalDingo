'use client'

import { motion } from 'framer-motion'
import type { Section } from '@/types/portfolio'

interface GalleryProps {
  content: Section['content']
  settings: Section['settings']
}

export default function Gallery({ content, settings }: GalleryProps) {
  const {
    title,
    subtitle,
    images = []
  } = content

  const {
    backgroundColor = 'white',
    textColor = 'inherit',
    padding = '4rem',
    layout = 'contained'
  } = settings

  return (
    <section
      className={`relative ${padding === '2rem' ? 'py-8' : padding === '4rem' ? 'py-16' : 'py-24'}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className={`${layout === 'contained' ? 'container mx-auto px-4' : 'px-4'}`}>
        {(title || subtitle) && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            {title && (
              <h2 className="font-heading text-3xl md:text-4xl mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="aspect-square relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                transition-opacity rounded-lg flex items-center justify-center"
              >
                <button
                  onClick={() => window.open(image, '_blank')}
                  className="px-6 py-2 bg-white text-black rounded-lg
                    hover:bg-neutral-100 transition-colors"
                >
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 