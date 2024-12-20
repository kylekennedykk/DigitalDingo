'use client'

import { motion } from 'framer-motion'
import type { Section } from '@/types/portfolio'

interface HeroProps {
  content: Section['content']
  settings: Section['settings']
}

export default function Hero({ content, settings }: HeroProps) {
  const {
    title,
    subtitle,
    backgroundImage,
    buttons = []
  } = content

  const {
    backgroundColor = 'transparent',
    textColor = 'white',
    padding = '4rem',
    layout = 'full'
  } = settings

  return (
    <section
      className={`relative ${padding === '2rem' ? 'py-8' : padding === '4rem' ? 'py-16' : 'py-24'}`}
      style={{ backgroundColor }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            opacity: 0.7
          }}
        />
      )}

      {/* Content */}
      <div className={`relative ${layout === 'contained' ? 'container mx-auto px-4' : 'px-4'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
          style={{ color: textColor }}
        >
          {title && (
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90">
              {subtitle}
            </p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.url}
                  className={`px-8 py-3 rounded-lg transition-colors
                    ${button.style === 'primary'
                      ? 'bg-primary-ochre text-white hover:bg-primary-ochre/90'
                      : 'bg-white text-neutral-900 hover:bg-neutral-100'
                    }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
} 