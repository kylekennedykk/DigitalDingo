import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

const initializeAboutContent = async () => {
  try {
    const aboutRef = doc(db, 'content', 'about')
    await setDoc(aboutRef, {
      mainText: "Welcome to DigitalDingo, where we craft high-performance websites and digital solutions for businesses across the UK and beyond.",
      mission: "Our mission is to deliver exceptional digital experiences that combine Australian Indigenous-inspired design with cutting-edge technology.",
      vision: "We envision a digital landscape where cultural heritage and modern technology coexist harmoniously, creating unique and meaningful web experiences."
    })
    console.log('About content initialized successfully')
  } catch (error) {
    console.error('Error initializing about content:', error)
  }
}

initializeAboutContent() 