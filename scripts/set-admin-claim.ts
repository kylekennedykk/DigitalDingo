import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase/admin'

async function setAdminClaim(email: string) {
  try {
    const auth = getAuth(adminApp)
    const user = await auth.getUserByEmail(email)
    
    await auth.setCustomUserClaims(user.uid, {
      admin: true
    })
    
    console.log('Admin claim set successfully')
  } catch (error) {
    console.error('Error setting admin claim:', error)
  }
}

// Updated email
setAdminClaim('kyle@digitaldingo.uk') 