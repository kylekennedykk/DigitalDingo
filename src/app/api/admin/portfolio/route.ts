import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import type { PortfolioSite } from '@/types/portfolio'

export async function GET() {
  try {
    const db = getFirestore()
    const sitesSnapshot = await db.collection('portfolio-sites')
      .orderBy('updatedAt', 'desc')
      .get()

    const sites = sitesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('Error fetching portfolio sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio sites' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = getFirestore()
    
    // Generate a URL-friendly slug from the name
    const slug = data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const newSite: Omit<PortfolioSite, 'id'> = {
      ...data,
      slug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [],
      settings: {
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#D17B30'
        },
        fonts: {
          heading: 'Plus Jakarta Sans',
          body: 'Inter'
        }
      }
    }

    const docRef = await db.collection('portfolio-sites').add(newSite)
    
    return NextResponse.json({
      id: docRef.id,
      ...newSite
    })
  } catch (error) {
    console.error('Error creating portfolio site:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio site' },
      { status: 500 }
    )
  }
} 