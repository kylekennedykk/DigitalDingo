'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Section } from '@/types/portfolio'

interface TestimonialsProps {
  content: Section['content']
  settings: Section['settings']
}

interface Testimonial {
  author: string
  role?: string
  image?: string
  content: string
  rating?: number
}

export default function Testimonials({ content, settings }: TestimonialsProps) {
  const {
    title,
    subtitle,
    testimonials = []
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <motion.div
              key={index}
              className="bg-white/5 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
              )}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-center mb-4">
                "{testimonial.content}"
              </blockquote>
              <div className="text-center">
                <div className="font-medium">{testimonial.author}</div>
                {testimonial.role && (
                  <div className="text-sm opacity-80">{testimonial.role}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 