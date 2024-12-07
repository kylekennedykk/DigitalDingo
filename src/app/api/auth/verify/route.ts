import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { adminAuth } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const session = cookies().get('session')?.value

    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    const decodedClaims = await getAuth(adminAuth).verifySessionCookie(session, true)

    if (!decodedClaims.admin) {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    return NextResponse.json({ status: 'valid' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
} 