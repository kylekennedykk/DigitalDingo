import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'

const initializeAnalytics = async () => {
  try {
    // Initialize latest analytics document
    await adminDb.collection('analytics').doc('latest').set({
      pageViews: 0,
      uniqueVisitors: 0,
      chatSessions: 0,
      averageSessionDuration: 0,
      portfolioViews: 0,
      contactSubmissions: 0,
      timestamp: Timestamp.now()
    })

    // Initialize timeline data for last 30 days
    const timelineRef = adminDb.collection('analytics_timeline')
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      await timelineRef.doc(dateString).set({
        pageViews: Math.floor(Math.random() * 100),
        uniqueVisitors: Math.floor(Math.random() * 50),
        date: dateString,
        timestamp: Timestamp.now()
      })
    }

    console.log('Analytics data initialized successfully')
  } catch (error) {
    console.error('Error initializing analytics:', error)
  }
}

initializeAnalytics() 