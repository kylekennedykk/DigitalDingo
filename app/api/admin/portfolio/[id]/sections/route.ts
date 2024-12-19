import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import type { Section } from '@/types/portfolio'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sectionsSnapshot = await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .orderBy('order')
      .get()

    const sections = sectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const db = getFirestore(app)
    
    // Get the current highest order
    const lastSection = await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .orderBy('order', 'desc')
      .limit(1)
      .get()

    const nextOrder = lastSection.empty ? 0 : lastSection.docs[0].data().order + 1

    const newSection: Omit<Section, 'id'> = {
      type: data.type,
      order: nextOrder,
      content: {
        title: '',
        subtitle: '',
        text: '',
        ...data.content
      },
      settings: {
        backgroundColor: 'transparent',
        textColor: 'inherit',
        padding: '4rem',
        layout: 'contained',
        ...data.settings
      }
    }

    // Create the section document
    const docRef = await db
      .collection('portfolio-sites')
      .doc(params.id)
      .collection('sections')
      .add(newSection)

    // Update the site's updatedAt timestamp
    await db.collection('portfolio-sites').doc(params.id).update({
      updatedAt: new Date().toISOString()
    })

    // Get the created section to return
    const sectionDoc = await docRef.get()
    const createdSection = {
      id: sectionDoc.id,
      ...sectionDoc.data()
    }

    return NextResponse.json(createdSection)
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
} 