'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import type { Section } from '@/types/portfolio'

interface LocationProps {
  content: Section['content']
  settings: Section['settings']
}

export default function Location({ content, settings }: LocationProps) {
  const {
    title,
    subtitle,
    address,
    mapUrl,
    phone,
    email
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

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            ) : (
              <div className="h-[400px] bg-neutral-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-12 h-12 opacity-20" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {address && (
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Address</h3>
                  <p className="whitespace-pre-line opacity-80">{address}</p>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex gap-4">
                <Phone className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Phone</h3>
                  <a
                    href={`tel:${phone}`}
                    className="opacity-80 hover:opacity-100"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex gap-4">
                <Mail className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <a
                    href={`mailto:${email}`}
                    className="opacity-80 hover:opacity-100"
                  >
                    {email}
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 