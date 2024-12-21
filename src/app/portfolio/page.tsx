'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageWithFlow from '@/components/layout/PageWithFlow'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { db, storage } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot 
} from '@firebase/firestore'
import { ref, getDownloadURL } from '@firebase/storage'
import Image from 'next/image'

interface PortfolioItem {
  id: string
  title: string
  description: string
  thumbnail: string
  published: boolean
  link?: string
  name?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching portfolio items...')
        
        const portfolioRef = collection(db, 'portfolio-external')
        const snapshot = await getDocs(portfolioRef)
        
        if (snapshot.empty) {
          console.log('No portfolio items found')
          setPortfolioItems([])
          return
        }

        const items = await Promise.all(
          snapshot.docs
            .filter((doc) => {
              const data = doc.data()
              console.log('Processing doc:', doc.id, data)
              return data.published === true
            })
            .map(async (doc) => {
              const data = doc.data()
              return {
                id: doc.id,
                title: data.name || '',
                description: data.description || '',
                thumbnail: data.thumbnail || '/images/placeholder-portfolio.jpg',
                published: data.published || false,
                link: data.link || ''
              }
            })
        )

        console.log('Processed portfolio items:', items)
        setPortfolioItems(items)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setError('Failed to load portfolio items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  if (loading) {
    return (
      <PageWithFlow variant="dark" opacity={0.8}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-black text-xl">Loading portfolio...</div>
        </div>
      </PageWithFlow>
    )
  }

  if (error) {
    return (
      <PageWithFlow variant="dark" opacity={0.8}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-black text-xl">{error}</div>
        </div>
      </PageWithFlow>
    )
  }

  return (
    <PageWithFlow variant="dark" opacity={0.8}>
      <main>
        {/* Hero Section */}
        <section className="relative py-32">
          <div className="relative z-10">
            <div className="container mx-auto px-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center"
              >
                <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-black">
                  Our Portfolio
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-black">
                  Showcasing our finest digital creations
                </p>
                <p className="text-base md:text-lg max-w-3xl mx-auto text-black">
                  Explore our collection of successful projects where creativity meets functionality. 
                  Each project represents our commitment to delivering exceptional digital experiences.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={container}
            >
              {portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeIn}
                  className="group relative overflow-hidden rounded-2xl bg-white/90 shadow-xl 
                    transition-all duration-300 hover:shadow-2xl border border-white/20
                    transform hover:-translate-y-1"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <Image 
                      src={item.thumbnail || '/images/placeholder-portfolio.jpg'}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => {
                        console.warn(`Failed to load image for ${item.title}`)
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-3">
                      {item.title}
                    </h3>
                    <p className="text-black">
                      {item.description}
                    </p>
                    {item.link && (
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-4 text-black hover:underline"
                      >
                        View Project <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-neutral-900 text-white py-32">
          <motion.div 
            className="container mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-6xl mb-8">
                Ready to Start Your 
                <span className="text-white"> Journey?</span>
              </h2>
              <p className="text-xl mb-12 text-neutral-300">
                Let&apos;s create something extraordinary together. Contact us today to discuss
                your project and discover how we can help bring your vision to life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 
                  rounded-full hover:bg-neutral-900 hover:text-white hover:scale-105
                  hover:border-white transition-all duration-300 font-medium text-lg
                  border-2 border-white shadow-lg hover:shadow-xl gap-2"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </PageWithFlow>
  )
} 