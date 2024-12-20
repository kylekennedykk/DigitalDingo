import { Timestamp } from 'firebase/firestore'

export const getDateFromTimestamp = (timestamp: any) => {
  if (!timestamp) return new Date()
  
  // Handle admin SDK Timestamp
  if (timestamp?.seconds && timestamp?.nanoseconds) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  }
  
  // Handle client SDK Timestamp
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  
  // Handle ISO string or timestamp number
  return new Date(timestamp)
} 