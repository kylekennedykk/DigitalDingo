import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: Date
}

export function usePortfolioItems(itemLimit: number = 3) {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        const timeoutId = setTimeout(() => {
          setLoading(false)
          setError('Request timed out')
        }, 10000)

        const q = query(
          collection(db, 'portfolio-external'),
          orderBy('createdAt', 'desc'),
          limit(itemLimit)
        )
        
        const querySnapshot = await getDocs(q)
        
        clearTimeout(timeoutId)

        if (querySnapshot.empty) {
          setItems([])
          setLoading(false)
          return
        }

        const portfolioItems = querySnapshot.docs.map(doc => {
          const data = doc.data()
          console.log('Portfolio item data:', data)
          
          let createdDate = new Date()
          if (data.createdAt) {
            if (typeof data.createdAt.toDate === 'function') {
              createdDate = data.createdAt.toDate()
            } else if (data.createdAt instanceof Date) {
              createdDate = data.createdAt
            } else if (typeof data.createdAt === 'string') {
              createdDate = new Date(data.createdAt)
            } else if (typeof data.createdAt === 'number') {
              createdDate = new Date(data.createdAt)
            }
          }

          return {
            id: doc.id,
            title: data.title || data.name || data.projectTitle || 'Untitled Project',
            description: data.description || data.desc || data.projectDescription || 'No description available',
            imageUrl: data.imageUrl || data.image || data.thumbnail || data.coverImage || '/images/placeholder.jpg',
            createdAt: createdDate,
          }
        }) as PortfolioItem[]

        console.log('Processed portfolio items:', portfolioItems)
        setItems(portfolioItems)
      } catch (err) {
        console.error('Error fetching portfolio items:', err)
        setError('Failed to load portfolio items')
        if (process.env.NODE_ENV === 'development') {
          setItems([
            {
              id: '1',
              title: 'Sample Project 1',
              description: 'This is a sample project for development',
              imageUrl: '/images/outback-1.jpg',
              createdAt: new Date()
            },
            {
              id: '2',
              title: 'Sample Project 2',
              description: 'Another sample project for development',
              imageUrl: '/images/outback-2.jpg',
              createdAt: new Date()
            },
            {
              id: '3',
              title: 'Sample Project 3',
              description: 'Yet another sample project for development',
              imageUrl: '/images/outback-3.jpg',
              createdAt: new Date()
            }
          ])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [itemLimit])

  return { items, loading, error }
} 