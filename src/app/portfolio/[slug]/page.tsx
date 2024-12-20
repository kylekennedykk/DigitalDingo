'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPortfolioBySlug } from '@/lib/firebase/firebaseUtils'
import LoadingSpinner from '@/components/LoadingSpinner'

interface PortfolioData {
  title: string
  description: string
  sections: {
    type: string
    content: any
  }[]
  theme: {
    colors: {
      primary: string
      secondary: string
      accent: string
    }
  }
}

export default function PortfolioPage() {
  const { slug } = useParams()
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        if (typeof slug === 'string') {
          const data = await getPortfolioBySlug(slug)
          setPortfolio(data as PortfolioData)
        }
      } catch (error) {
        console.error('Error loading portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [slug])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!portfolio) {
    return <div>Portfolio not found</div>
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8" 
            style={{color: portfolio.theme.colors.primary}}>
          {portfolio.title}
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-12">{portfolio.description}</p>
          
          {portfolio.sections.map((section, index) => (
            <section 
              key={index}
              className="mb-16"
              style={{
                backgroundColor: index % 2 === 0 
                  ? portfolio.theme.colors.secondary + '20'
                  : 'transparent'
              }}
            >
              {/* Render different section types */}
              {renderSection(section)}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

function renderSection(section: { type: string; content: any }) {
  switch (section.type) {
    case 'text':
      return <div className="prose">{section.content}</div>
    case 'image':
      return (
        <img 
          src={section.content.url} 
          alt={section.content.alt || ''}
          className="w-full rounded-lg shadow-lg"
        />
      )
    case 'gallery':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.content.images.map((image: any, index: number) => (
            <img 
              key={index}
              src={image.url}
              alt={image.alt || ''}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>
      )
    default:
      return null
  }
} 