import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin/config'

export async function adminAuthMiddleware(request: Request) {
  try {
    const session = cookies().get('session')?.value

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedClaims = await getAuth(adminApp).verifySessionCookie(session)
    
    if (!decodedClaims.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
} 