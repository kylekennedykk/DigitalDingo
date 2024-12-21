import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const decodedClaims = await getAuth(adminApp).verifySessionCookie(session, true)
    return new Response(JSON.stringify(decodedClaims), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response('Unauthorized', { status: 401 })
  }
} 