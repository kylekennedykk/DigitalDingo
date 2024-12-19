import { initializeApp, getApps, cert, App } from 'firebase-admin/app'

let adminApp: App = getApps()[0]

if (!adminApp) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export default adminApp 