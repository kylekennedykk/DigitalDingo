'use client'

import { motion } from 'framer-motion'
import { Linkedin, Twitter, Mail } from 'lucide-react'
import type { Section } from '@/types/portfolio'
import Image from 'next/image'

interface TeamProps {
  content: Section['content']
  settings: Section['settings']
}

interface TeamMember {
  name: string
  role: string
  image?: string
  bio?: string
  social?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export default function Team({ content, settings }: TeamProps) {
  const {
    title,
    subtitle,
    team = []
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
          {team.map((member: TeamMember, index: number) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {member.image && (
                <div className="mb-4">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <h3 className="font-heading text-xl mb-1">{member.name}</h3>
              <p className="text-sm opacity-80 mb-4">{member.role}</p>
              {member.bio && (
                <p className="mb-4 opacity-90">{member.bio}</p>
              )}
              {member.social && (
                <div className="flex justify-center gap-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a
                      href={`mailto:${member.social.email}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 