'use client'

import { motion, Variants } from 'framer-motion'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { DreamtimeFlow } from '@/components/DreamtimeFlow'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const portfolioData = [
  {
    id: 1,
    title: 'Project One',
    description: 'Description of project one',
    image: '/images/outback-1.jpg',
    tags: ['Web Design', 'Development']
  },
  // Add more projects as needed
]

export function PortfolioContent() {
  return (
    <ErrorBoundary>
      <div className="relative">
        <DreamtimeFlow className="absolute inset-0" />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-24">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {portfolioData.map((item) => (
                <PortfolioCard 
                  key={item.id} 
                  item={{
                    id: item.id.toString(),
                    title: item.title,
                    description: item.description,
                    imageUrl: item.image,
                    tags: item.tags
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
} 