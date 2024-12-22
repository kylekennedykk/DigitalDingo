'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Smartphone, Tablet, Monitor, ExternalLink, Palette } from 'lucide-react'
import type { Section, Theme } from '@/types/portfolio'
import HeroSection from '@/components/sections/Hero'
import ContentSection from '@/components/sections/Content'
import GallerySection from '@/components/sections/Gallery'
import MenuSection from '@/components/sections/Menu'
import TestimonialsSection from '@/components/sections/Testimonials'
import TeamSection from '@/components/sections/Team'
import HoursSection from '@/components/sections/Hours'
import LocationSection from '@/components/sections/Location'
import FaqSection from '@/components/sections/Faq'
import { themes } from '@/lib/themes'

type DeviceSize = 'mobile' | 'tablet' | 'desktop' | 'full'

interface SectionPreviewProps {
  section: Section
  siteTheme?: string
  themeOverrides?: Partial<Theme>
  onClose: () => void
}

const deviceSizes = {
  mobile: {
    width: '375px',
    icon: Smartphone,
    label: 'Mobile'
  },
  tablet: {
    width: '768px',
    icon: Tablet,
    label: 'Tablet'
  },
  desktop: {
    width: '1280px',
    icon: Monitor,
    label: 'Desktop'
  },
  full: {
    width: '100%',
    icon: ExternalLink,
    label: 'Full Width'
  }
} as const

export default function SectionPreview({ 
  section, 
  siteTheme = 'default',
  themeOverrides,
  onClose 
}: SectionPreviewProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('full')
  const [activeTheme, setActiveTheme] = useState(siteTheme)
  const [showThemes, setShowThemes] = useState(false)

  const theme = {
    ...themes[activeTheme],
    ...themeOverrides
  }

  const renderSection = () => {
    const props = {
      content: section.content,
      settings: section.settings
    }

    switch (section.type) {
      case 'hero':
        return <HeroSection {...props} />
      case 'content':
        return <ContentSection {...props} />
      case 'gallery':
        return <GallerySection {...props} />
      case 'menu':
        return <MenuSection {...props} />
      case 'testimonials':
        return <TestimonialsSection {...props} />
      case 'team':
        return <TeamSection {...props} />
      case 'hours':
        return <HoursSection {...props} />
      case 'location':
        return <LocationSection {...props} />
      case 'faq':
        return <FaqSection {...props} />
      default:
        return <div>Section type not supported</div>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full h-full md:h-[90vh] md:w-[90vw] md:rounded-xl 
          shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h3 className="font-heading text-xl">
              Preview {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
            </h3>
            <div className="hidden md:flex items-center gap-2 ml-8">
              {(Object.entries(deviceSizes) as [DeviceSize, typeof deviceSizes[DeviceSize]][]).map(([size, config]) => (
                <button
                  key={size}
                  onClick={() => setDeviceSize(size)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2
                    ${deviceSize === size 
                      ? 'bg-neutral-100 text-neutral-900' 
                      : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  title={config.label}
                >
                  <config.icon className="w-5 h-5" />
                  <span className="text-sm">{config.label}</span>
                </button>
              ))}
            </div>
            <div className="relative ml-4">
              <button
                onClick={() => setShowThemes(!showThemes)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2
                  ${showThemes ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <Palette className="w-5 h-5" />
                <span className="text-sm">{themes[activeTheme].name}</span>
              </button>

              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border p-2 min-w-[200px]"
                >
                  {Object.values(themes).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setActiveTheme(theme.id)
                        setShowThemes(false)
                      }}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors
                        ${activeTheme === theme.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                      </div>
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="overflow-y-auto h-[calc(100%-65px)] bg-neutral-100">
          <div 
            className={`mx-auto transition-all duration-300 min-h-full`}
            style={{ 
              width: deviceSizes[deviceSize].width,
              maxWidth: '100%',
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontFamily: theme.fonts.body
            }}
          >
            <style jsx global>{`
              .font-heading {
                font-family: ${theme.fonts.heading}, system-ui;
              }
              .text-primary {
                color: ${theme.colors.primary};
              }
              .bg-primary {
                background-color: ${theme.colors.primary};
              }
              .text-secondary {
                color: ${theme.colors.secondary};
              }
              .bg-secondary {
                background-color: ${theme.colors.secondary};
              }
              .text-accent {
                color: ${theme.colors.accent};
              }
              .bg-accent {
                background-color: ${theme.colors.accent};
              }
            `}</style>
            {renderSection()}
          </div>
        </div>

        {/* Mobile Device Selector */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-center gap-2">
          {(Object.entries(deviceSizes) as [DeviceSize, typeof deviceSizes[DeviceSize]][]).map(([size, config]) => (
            <button
              key={size}
              onClick={() => setDeviceSize(size)}
              className={`p-2 rounded-lg transition-colors
                ${deviceSize === size 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-500 hover:text-neutral-900'
                }`}
              title={config.label}
            >
              <config.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 