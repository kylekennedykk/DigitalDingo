import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const initializePortfolioItems = async () => {
  try {
    const portfolioRef = collection(db, 'portfolio-external')
    
    const items = [
      {
        name: 'Test Project 1',
        description: 'A sample project',
        thumbnail: '/images/placeholder-portfolio.jpg',
        published: true,
        createdAt: new Date().toISOString()
      },
      // Add more test items as needed
    ]

    for (const item of items) {
      await addDoc(portfolioRef, item)
    }

    console.log('Portfolio items initialized successfully!')
  } catch (error) {
    console.error('Error initializing portfolio items:', error)
  }
}

initializePortfolioItems() 