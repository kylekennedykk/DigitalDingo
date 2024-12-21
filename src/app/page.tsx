'use client'

import React, { useEffect } from 'react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import PageWithFlow from '@/components/layout/PageWithFlow'
import { DreamtimeFlowProvider } from '@/lib/contexts/DreamtimeFlowContext'
import type { ReactElement, JSX } from 'react'

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

function HomeContent() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    const timer = setTimeout(() => {
      showFlow('fixed inset-0 -z-10')
    }, 100)

    return () => clearTimeout(timer)
  }, [showFlow])

  return (
    <PageWithFlow variant="dark" opacity={0.8}>
      <motion.section 
        className="relative min-h-screen"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.div 
          className="relative z-10 min-h-screen flex flex-col justify-between px-4"
          variants={fadeIn}
        >
          <div className="container mx-auto flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.h1 
                className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                variants={fadeIn}
              >
                <span className="text-black">Digital</span>
                <span className="text-primary-red">Dingo</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-neutral-800"
                variants={fadeIn}
              >
                Creating stunning, high-performance websites tailored to your unique vision
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={fadeIn}
              >
                <Link
                  href="/portfolio"
                  className="px-8 py-4 bg-transparent text-neutral-900 rounded-full
                    hover:bg-neutral-900 hover:text-white hover:scale-105
                    transition-all duration-300 font-medium text-lg
                    border-2 border-neutral-900
                    shadow-lg hover:shadow-xl
                    backdrop-blur-sm
                    min-w-[200px] text-center"
                >
                  View Our Work
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-neutral-900 rounded-full
                    hover:bg-neutral-900 hover:text-white hover:scale-105
                    hover:border-white
                    transition-all duration-300 font-medium text-lg
                    border-2 border-neutral-900
                    shadow-lg hover:shadow-xl
                    min-w-[200px] text-center"
                >
                  Start a Project
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </PageWithFlow>
  )
}

const HomePage = (): JSX.Element => {
  return (
    <DreamtimeFlowProvider>
      <HomeContent />
    </DreamtimeFlowProvider>
  )
}

export default HomePage
