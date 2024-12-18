'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { Section } from '@/types/portfolio'

interface HoursProps {
  content: Section['content']
  settings: Section['settings']
}

interface BusinessHours {
  open: string
  close: string
}

interface DayHours {
  [key: string]: BusinessHours
}

export default function Hours({ content, settings }: HoursProps) {
  const {
    title,
    subtitle,
    hours = {} as DayHours
  } = content

  const {
    backgroundColor = 'white',
    textColor = 'inherit',
    padding = '4rem',
    layout = 'contained'
  } = settings

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday'
  ]

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

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-xl p-8">
            {days.map((day, index) => (
              <motion.div
                key={day}
                className="flex justify-between items-center py-4 border-b last:border-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="font-medium capitalize">{day}</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {hours[day] ? (
                    <span>{hours[day].open} - {hours[day].close}</span>
                  ) : (
                    <span className="opacity-60">Closed</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 