import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'

export async function GET() {
  try {
    const db = getFirestore(app)
    const itemsSnapshot = await db
      .collection('portfolio-external')
      .orderBy('createdAt', 'desc')
      .get()

    const items = itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = getFirestore(app)
    
    const docRef = await db.collection('portfolio-external').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    const doc = await docRef.get()
    
    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
} 