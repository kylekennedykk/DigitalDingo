import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export async function signIn() {
  try {
    // Use environment variables for admin credentials
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (!email || !password) {
      throw new Error('Admin credentials not configured')
    }

    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
} 