'use client'

import { motion, Variants } from 'framer-motion'
import { DreamtimeFlow } from '@/components/DreamtimeFlow'
import Image from 'next/image'

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

export default function PortfolioContent() {
  return (
    <main>
      <section className="relative py-32 px-4">
        <DreamtimeFlow />
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center"
          >
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our <span className="text-primary-ochre">Portfolio</span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl mb-4 text-neutral-800">
                Showcasing our finest digital creations
              </p>
              <p className="text-base md:text-lg text-neutral-800">
                Explore our collection of successful projects where creativity meets functionality. 
                Each project represents our commitment to delivering exceptional digital experiences.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-white py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
          >
            {portfolioData.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeIn}
                className="group relative aspect-video overflow-hidden rounded-2xl bg-white/10
                  transform transition-transform hover:-translate-y-2"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white 
                  opacity-0 group-hover:opacity-100 transition-all duration-300 transform 
                  translate-y-4 group-hover:translate-y-0">
                  <h3 className="font-heading text-2xl mb-2">{project.title}</h3>
                  <p className="text-white/90">{project.description}</p>
                  <div className="flex gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-sm px-3 py-1 bg-white/20 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
} 