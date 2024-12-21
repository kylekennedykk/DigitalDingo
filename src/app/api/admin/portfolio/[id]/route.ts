import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import { NextRequest } from 'next/server'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const db = getFirestore()
    const docRef = await db.collection('portfolio-sites').doc(context.params.id).get()
    
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
  request: NextRequest,
  context: RouteContext
) {
  try {
    const data = await request.json()
    const db = getFirestore()
    
    await db.collection('portfolio-sites').doc(context.params.id).update({
      ...data,
      updatedAt: new Date().toISOString()
    })

    const updatedDoc = await db.collection('portfolio-sites').doc(context.params.id).get()
    
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
  request: NextRequest,
  context: RouteContext
) {
  try {
    const db = getFirestore()
    await db.collection('portfolio-sites').doc(context.params.id).delete()
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error deleting portfolio site:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio site' },
      { status: 500 }
    )
  }
}