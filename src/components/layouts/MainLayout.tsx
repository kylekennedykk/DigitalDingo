import { ReactNode } from 'react'
import { SEO } from '@/components/shared/SEO'

interface MainLayoutProps {
  children: ReactNode
  seo?: {
    title: string
    description: string
    keywords: string
    image?: string
    article?: boolean
  }
}

export function MainLayout({ 
  children, 
  seo = {
    title: 'DigitalDingo | Indigenous-Inspired Web Design & Development',
    description: 'Professional web design company blending Australian Indigenous aesthetics with modern web development.',
    keywords: 'web design, indigenous design, australian web development'
  }
}: MainLayoutProps) {
  return (
    <>
      <SEO 
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />
      {children}
    </>
  )
} 