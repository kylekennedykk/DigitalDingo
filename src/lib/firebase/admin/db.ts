import { getFirestore } from 'firebase-admin/firestore'
import adminApp from './config'

export const db = getFirestore(adminApp) 