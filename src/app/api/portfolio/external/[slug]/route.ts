import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'

const db = getFirestore(app)

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const sitesRef = db.collection('externalSites')
    const snapshot = await sitesRef.where('id', '==', params.slug).limit(1).get()
    
    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }
    
    const site = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    }
    
    return NextResponse.json(site)
  } catch (error) {
    console.error('Error fetching site:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    )
  }
} 