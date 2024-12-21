import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { sessionCookie } = await request.json()
  
  const cookieStore = await cookies()
  cookieStore.set('session', sessionCookie, {
    maxAge: 60 * 60 * 24 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  
  return new Response('OK')
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return new Response('OK')
} 