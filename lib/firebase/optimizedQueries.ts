import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  type QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase'
import type { PortfolioSite, ExternalPortfolioItem } from '@/types/portfolio'

export const getPortfolioItems = async (options: {
  limit?: number
  published?: boolean
  featured?: boolean
} = {}) => {
  const constraints: QueryConstraint[] = []
  
  if (typeof options.published === 'boolean') {
    constraints.push(where('published', '==', options.published))
  }
  
  if (typeof options.featured === 'boolean') {
    constraints.push(where('featured', '==', options.featured))
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  if (options.limit) {
    constraints.push(limit(options.limit))
  }

  const q = query(collection(db, 'portfolio'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ExternalPortfolioItem[]
}

export const getPortfolioSite = async (id: string) => {
  const docRef = doc(db, 'portfolio-sites', id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) {
    throw new Error('Site not found')
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as PortfolioSite
}

export const updatePortfolioSite = async (id: string, data: Partial<PortfolioSite>) => {
  const docRef = doc(db, 'portfolio-sites', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  })
} 