import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

// Keep the original signIn function for direct Firebase auth
export async function signIn() {
  try {
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )

          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    }
  }
} 