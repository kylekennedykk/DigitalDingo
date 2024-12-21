import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

async function createAdminUser() {
  try {
    const auth = getAuth(adminApp)
    
    // Create user with admin privileges
    const userRecord = await auth.createUser({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      emailVerified: true,
    })

    // Set custom claims for admin access
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true
    })

    console.log('Admin user created successfully:', userRecord.uid)
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser() 