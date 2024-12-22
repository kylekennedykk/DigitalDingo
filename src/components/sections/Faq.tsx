'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Section } from '@/types/portfolio'

interface FaqProps {
  content: Section['content']
  settings: Section['settings']
}

interface FaqItem {
  question: string
  answer: string
}

export default function Faq({ content, settings }: FaqProps) {
  const {
    title,
    subtitle,
    faqs = [] as FaqItem[]
  } = content

  const {
    backgroundColor = 'white',
    textColor = 'inherit',
    padding = '4rem',
    layout = 'contained'
  } = settings

  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

        <div className="max-w-3xl mx-auto divide-y">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-start gap-4 text-left"
              >
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform
                    ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 prose prose-lg max-w-none">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 