import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Convert the private key string to proper format
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
}

// Initialize Firebase Admin only if it hasn't been initialized
const adminApp = getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0]
const adminDb = getFirestore(adminApp)

export { adminApp, adminDb }