import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Get ID token and create session cookie
    const idToken = await userCredential.user.getIdToken()
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
  }

  return {
    user,
    loading,
    signIn,
    signOut
  }
}