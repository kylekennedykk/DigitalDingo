import { useQuery } from '@tanstack/react-query'
import { collection, query, orderBy, limit, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp } from '@firebase/firestore'
import { db } from '@/lib/firebase'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: Date
  url?: string
}

export function usePortfolioItems(itemLimit: number = 3) {
  return useQuery<PortfolioItem[], Error>({
    queryKey: ['portfolio-items', itemLimit],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, 'portfolio-external'),
          orderBy('createdAt', 'desc'),
          limit(itemLimit)
        )
        const snapshot = await getDocs(q)
        
        if (snapshot.empty) {
          return []
        }

        return snapshot.docs
          .filter((doc: QueryDocumentSnapshot<DocumentData>) => doc.data().published)
          .map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data()
            
            // Convert timestamp string to Date
            let createdDate: Date
            try {
              if (data.createdAt instanceof Timestamp) {
                createdDate = data.createdAt.toDate()
              } else if (typeof data.createdAt === 'string') {
                createdDate = new Date(data.createdAt)
              } else {
                createdDate = new Date()
              }
            } catch (error) {
              createdDate = new Date()
            }

            return {
              id: doc.id,
              title: data.name || 'Untitled Project',
              description: data.description || 'No description available',
              imageUrl: data.thumbnail || '/images/placeholder-portfolio.jpg',
              createdAt: createdDate,
              url: data.url || null
            }
          })
      } catch (error) {
        console.error('Error in usePortfolioItems:', error)
        throw new Error('Failed to fetch portfolio items. Please try again.')
      }
    },
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2
  })
} 