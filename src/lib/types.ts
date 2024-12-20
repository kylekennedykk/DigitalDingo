import { Timestamp } from 'firebase/firestore'

export interface ContactMetadata {
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

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'in-progress' | 'completed'
  timestamp?: Date | string
  metadata?: ContactMetadata
} 