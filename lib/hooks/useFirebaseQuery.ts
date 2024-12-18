import { useState, useEffect } from 'react'
import { 
  query, 
  collection, 
  QueryConstraint, 
  onSnapshot,
  DocumentData
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createErrorMessage } from '@/lib/utils/error'

interface UseFirebaseQueryOptions<T> {
  path: string
  constraints?: QueryConstraint[]
  transform?: (doc: DocumentData) => T
}

export function useFirebaseQuery<T = DocumentData>({ 
  path, 
  constraints = [],
  transform
}: UseFirebaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, path), ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          }
          return transform ? transform(data) : data
        }) as T[]
        
        setData(items)
        setLoading(false)
        setError(null)
      },
      (error) => {
        setError(createErrorMessage(error))
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [path, constraints, transform])

  return { data, loading, error }
} 