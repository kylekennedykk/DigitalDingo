import { getAuth, createUser } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

async function createAdminUser() {
  try {
    const auth = getAuth(adminApp)
    
    // Create admin user
    const userRecord = await auth.createUser({
      email: 'kyle@digitaldingo.uk',
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
      emailVerified: true,
    })

    // Set admin claim
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true
    })

    console.log('Admin user created successfully:', userRecord.uid)
    console.log('Admin claims set successfully')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser() 