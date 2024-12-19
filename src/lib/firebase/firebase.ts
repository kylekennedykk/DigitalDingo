import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase with error handling
if (!getApps().length) {
  try {
    initializeApp(firebaseConfig)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

// Initialize Firestore with settings
const db = getFirestore()

// Configure Firestore settings
db.settings({
  cacheSizeBytes: 50000000, // 50MB cache size
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: true,
})

export { db } 