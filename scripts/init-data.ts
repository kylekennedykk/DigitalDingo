import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'

async function initializeData() {
  try {
    // Initialize analytics
    await initAnalytics()
    
    // Initialize about content
    await initAboutContent()
    
    console.log('All data initialized successfully!')
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}

async function initAnalytics() {
  // Existing analytics initialization code
  await adminDb.collection('analytics').doc('latest').set({
    pageViews: 0,
    uniqueVisitors: 0,
    chatSessions: 0,
    averageSessionDuration: 0,
    portfolioViews: 0,
    contactSubmissions: 0,
    timestamp: Timestamp.now()
  })

  // Initialize timeline data
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
}

async function initAboutContent() {
  await adminDb.collection('content').doc('about').set({
    mainText: "Welcome to DigitalDingo, where we craft high-performance websites and digital solutions for businesses across the UK and beyond.",
    mission: "Our mission is to deliver exceptional digital experiences that combine Australian Indigenous-inspired design with cutting-edge technology.",
    vision: "We envision a digital landscape where cultural heritage and modern technology coexist harmoniously, creating unique and meaningful web experiences."
  })
}

initializeData() 