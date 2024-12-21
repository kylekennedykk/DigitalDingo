import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'

const db = getFirestore(app)

export async function GET() {
  try {
    const sitesRef = db.collection('externalSites')
    const snapshot = await sitesRef.get()
    
    const sites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json(sites)
  } catch (error) {
    console.error('Error fetching external sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch external sites' },
      { status: 500 }
    )
  }
} 