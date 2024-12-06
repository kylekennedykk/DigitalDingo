'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { usePortfolioItems } from '@/lib/hooks/usePortfolioItems'

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

export function LatestProjects() {
  const { items, loading, error } = usePortfolioItems(3)

  if (loading) {
    return (
      <section className="bg-[#D17B30] py-32">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl md:text-5xl text-center mb-16 text-white">
            Latest Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/20 h-64 rounded-2xl mb-4" />
                <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return null
  }

  return (
    <section className="bg-[#D17B30] py-32">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.h2 
          className="font-heading text-4xl md:text-5xl text-center mb-16 text-white"
          variants={fadeIn}
        >
          Latest Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeIn}
              className="group relative aspect-video overflow-hidden rounded-2xl bg-white/10
                transform transition-transform hover:-translate-y-2"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white 
                opacity-0 group-hover:opacity-100 transition-all duration-300 transform 
                translate-y-4 group-hover:translate-y-0">
                <h3 className="font-heading text-2xl mb-2">{item.title}</h3>
                <p className="text-white/90">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn}
        >
          <Link 
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium 
              bg-white text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white 
              transition-all duration-300 hover:scale-105 border-2 border-transparent 
              hover:border-white"
          >
            View All Projects
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
} 