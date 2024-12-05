'use client'

import { motion } from 'framer-motion'
import type { Section } from '@/types/portfolio'

interface ContentProps {
  content: Section['content']
  settings: Section['settings']
}

export default function Content({ content, settings }: ContentProps) {
  const {
    title,
    subtitle,
    text,
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {title && (
            <h2 className="font-heading text-3xl md:text-4xl mb-4 text-center">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl mb-8 text-center opacity-80">
              {subtitle}
            </p>
          )}
          {text && (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {images.map((image, index) => (
                <motion.img
                  key={index}
                  src={image}
                  alt=""
                  className="w-full h-64 object-cover rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
} 