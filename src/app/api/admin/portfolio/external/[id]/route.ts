import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const db = getFirestore(app)
    
    await db.collection('portfolio-external').doc(params.id).update({
      ...data,
      updatedAt: new Date().toISOString()
    })

    const doc = await db.collection('portfolio-external').doc(params.id).get()
    
    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestore(app)
    await db.collection('portfolio-external').doc(params.id).delete()
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
} 