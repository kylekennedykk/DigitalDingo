import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  type CollectionReference,
  type Query,
  type QuerySnapshot,
  type DocumentData
} from 'firebase/firestore'
import { db } from './firebase'

export async function getLatestPortfolioItems(count = 6) {
  const portfolioRef = collection(db, 'portfolio') as CollectionReference<DocumentData>
  const q = query(
    portfolioRef,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function getFeaturedPortfolioItems(count = 3) {
  const portfolioRef = collection(db, 'portfolio') as CollectionReference<DocumentData>
  const q = query(
    portfolioRef,
    where('published', '==', true),
    where('featured', '==', true),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
} 