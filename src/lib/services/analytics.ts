import { db } from '@/lib/firebase'
import { doc, increment, updateDoc, serverTimestamp } from 'firebase/firestore'

export const analyticsService = {
  async trackPageView() {
    try {
      const analyticsRef = doc(db, 'analytics', 'latest')
      await updateDoc(analyticsRef, {
        pageViews: increment(1),
        timestamp: serverTimestamp()
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  },

  async trackChatSession() {
    try {
      const analyticsRef = doc(db, 'analytics', 'latest')
      await updateDoc(analyticsRef, {
        chatSessions: increment(1),
        timestamp: serverTimestamp()
      })
    } catch (error) {
      console.error('Error tracking chat session:', error)
    }
  },

  async trackPortfolioView() {
    try {
      const analyticsRef = doc(db, 'analytics', 'latest')
      await updateDoc(analyticsRef, {
        portfolioViews: increment(1),
        timestamp: serverTimestamp()
      })
    } catch (error) {
      console.error('Error tracking portfolio view:', error)
    }
  },

  async trackContactSubmission() {
    try {
      const analyticsRef = doc(db, 'analytics', 'latest')
      await updateDoc(analyticsRef, {
        contactSubmissions: increment(1),
        timestamp: serverTimestamp()
      })
    } catch (error) {
      console.error('Error tracking contact submission:', error)
    }
  }
} 