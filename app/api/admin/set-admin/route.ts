import { setAdminClaim } from '@/lib/firebase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { uid } = await request.json()
    await setAdminClaim(uid)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set admin claim' }, { status: 500 })
  }
} 