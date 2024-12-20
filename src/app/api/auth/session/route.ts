import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await getAuth(adminApp)
      .createSessionCookie(idToken, { expiresIn })

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  cookies().delete('session')
  return NextResponse.json({ status: 'success' })
} 