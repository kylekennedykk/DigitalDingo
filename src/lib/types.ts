import { Timestamp } from 'firebase/firestore'

export interface Note {
  id: string
  content: string
  timestamp: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'in-progress' | 'completed'
  createdAt: Timestamp
  lastUpdated: Timestamp
  notes: Note[]
  source?: string
  metadata?: {
    timestamp: number
    userAgent: string
    language: string
    screenResolution: string
    timezone: string
    platform: string
    referrer: string
    location?: {
      country?: string
      region?: string
      city?: string
    }
  }
} 