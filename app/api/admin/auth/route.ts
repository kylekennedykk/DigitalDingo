import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    await adminAuth.verifyIdToken(token)
    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
} 