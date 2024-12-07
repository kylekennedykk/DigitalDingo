import { NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify token and check admin claim
    const decodedToken = await getAuth(adminApp).verifyIdToken(token)
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Proceed with fetching analytics data
    const db = getFirestore(adminApp)
    
    // Fetch analytics data
    const analyticsRef = db.collection('analytics').doc('latest')
    const analyticsDoc = await analyticsRef.get()
    
    if (!analyticsDoc.exists) {
      return NextResponse.json({ error: 'No analytics data found' }, { status: 404 })
    }

    const data = analyticsDoc.data()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 