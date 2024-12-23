'use client'

import { useEffect, useState } from 'react'
import { VirtualList } from '@/components/ui/VirtualList'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore'
import type { PortfolioSite } from '@/types/portfolio'

const ITEMS_PER_PAGE = 10

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioSite[]>([])
  const [loading, setLoading] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)

  const loadItems = async (isInitial = false) => {
    try {
      let q = query(
        collection(db, 'portfolio-sites'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      )

      if (!isInitial && lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioSite[]

      setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE)

      if (isInitial) {
        setItems(newItems)
      } else {
        setItems(prev => [...prev, ...newItems])
      }
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems(true)
  }, [])

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadItems()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Portfolio Sites</h1>
      
      <VirtualList
        items={items}
        height={600}
        itemHeight={100}
        className="bg-white rounded-lg shadow"
        onEndReached={hasMore ? handleLoadMore : undefined}
        renderItem={(item) => (
          <div className="p-4 border-b hover:bg-gray-50">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex gap-2 mt-2">
              {item.tags?.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  )
} 