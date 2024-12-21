import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

type Params = { params: { id: string; sectionId: string } }

export async function GET(request: Request, { params }: Params) {
  try {
    const db = getFirestore()
    const docRef = await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .doc(params.sectionId)
      .get()

    if (!docRef.exists) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: docRef.id,
      ...docRef.data()
    })
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const data = await request.json()
    const db = getFirestore()
    
    await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .doc(params.sectionId)
      .update(data)

    // Update the site's updatedAt timestamp
    await db.collection('portfolio-sites').doc(params.id).update({
      updatedAt: new Date().toISOString()
    })

    const updatedDoc = await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .doc(params.sectionId)
      .get()

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    })
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const db = getFirestore()
    
    // Delete the section
    await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .doc(params.sectionId)
      .delete()

    // Update the site's updatedAt timestamp
    await db.collection('portfolio-sites').doc(params.id).update({
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
} 