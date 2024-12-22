import { ReactNode } from 'react'
import { SEO } from '@/components/shared/SEO'

interface MainLayoutProps {
  children: ReactNode
  seo?: {
    title?: string
    description?: string
    image?: string
    article?: boolean
    keywords?: string
  }
}

export function MainLayout({ children, seo }: MainLayoutProps) {
  return (
    <>
      <SEO {...seo} />
      {children}
    </>
  )
} 