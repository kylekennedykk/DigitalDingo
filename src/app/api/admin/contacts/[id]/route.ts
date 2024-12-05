import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestore()
    const docRef = await db.collection('contacts').doc(params.id).get()
    
    if (!docRef.exists) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: docRef.id,
      ...docRef.data()
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const db = getFirestore(app)
    
    await db.collection('contacts').doc(params.id).update({
      status,
      lastUpdated: new Date().toISOString()
    })

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
} 