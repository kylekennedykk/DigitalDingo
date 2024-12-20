import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { auth } from 'firebase-admin'

const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
}

export const adminApp = getApps().length === 0 
  ? initializeApp(adminConfig) 
  : getApps()[0]

export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)

export async function setAdminClaim(uid: string) {
  try {
    await getAuth().setCustomUserClaims(uid, { admin: true })
    return { success: true }
  } catch (error) {
    console.error('Error setting admin claim:', error)
    throw error
  }
}

export default adminApp