'use client'

import { motion } from 'framer-motion'
import type { Section } from '@/types/portfolio'
import Image from 'next/image'

interface MenuProps {
  content: Section['content']
  settings: Section['settings']
}

interface MenuItem {
  name: string
  description: string
  price: string
  image?: string
}

interface MenuCategory {
  name: string
  items: MenuItem[]
}

export default function Menu({ content, settings }: MenuProps) {
  const {
    title,
    subtitle,
    categories = []
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

        <div className="max-w-4xl mx-auto space-y-12">
          {categories.map((category: MenuCategory, categoryIndex: number) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.2 }}
            >
              <h3 className="font-heading text-2xl mb-6 text-center">
                {category.name}
              </h3>
              <div className="grid gap-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex gap-4 items-start p-4 bg-white/5 rounded-lg"
                  >
                    {item.image && (
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={400}
                        height={300}
                        className="rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-medium text-lg">{item.name}</h4>
                        <div className="font-medium whitespace-nowrap">
                          {item.price}
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm opacity-80">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 