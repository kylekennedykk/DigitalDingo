import { NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log('Setting admin role for:', email)
    console.log('Admin app initialized:', !!adminApp)
    
    try {
      // List users to verify Firebase connection
      const listUsers = await getAuth(adminApp).listUsers(1)
      console.log('Firebase connection verified, can list users:', !!listUsers)
    } catch (e) {
      console.error('Error listing users:', e)
    }
    
    // Get user by email
    const user = await getAuth(adminApp).getUserByEmail(email)
    console.log('Found user:', user.uid)
    
    // Set custom claims
    await getAuth(adminApp).setCustomUserClaims(user.uid, {
      admin: true
    })
    console.log('Admin role set successfully')

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error setting admin role:', error)
    return NextResponse.json({ 
      error: 'Failed to set admin role', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 