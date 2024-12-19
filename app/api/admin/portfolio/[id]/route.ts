import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = await db.collection('portfolio-sites').doc(params.id).get()
    
    if (!docRef.exists) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: docRef.id,
      ...docRef.data()
    })
  } catch (error) {
    console.error('Error fetching portfolio site:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio site' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    await db.collection('portfolio-sites').doc(params.id).update({
      ...data,
      updatedAt: Timestamp.now()
    })

    const updatedDoc = await db.collection('portfolio-sites').doc(params.id).get()
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    })
  } catch (error) {
    console.error('Error updating portfolio site:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio site' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestore()
    await db.collection('portfolio-sites').doc(params.id).delete()
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error deleting portfolio site:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio site' },
      { status: 500 }
    )
  }
} 