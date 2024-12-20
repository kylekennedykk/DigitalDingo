'use client'

import React, { useEffect } from 'react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { 
  Globe2, 
  Palette, 
  Megaphone, 
  Layers, 
  Search, 
  Pencil, 
  Code2, 
  TestTube, 
  Rocket,
  BarChart3,
  Wrench
} from 'lucide-react'
import { GradientCard } from '@/components/GradientCard'
import Image from 'next/image'
import { PageWithFlow } from '@/components/layout/PageWithFlow'
import dynamic from 'next/dynamic'

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
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

const LatestProjects = dynamic(
  () => import('@/components/LatestProjects').then(mod => mod.LatestProjects),
  {
    loading: () => <div className="h-[600px]" />
  })

export default function HomePage() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow('fixed inset-0 -z-10')
  }, [showFlow])

  return (
    <PageWithFlow variant="dark" opacity={0.8}>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="relative z-10 min-h-screen flex flex-col justify-between px-4">
          <div className="container mx-auto flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                <span className="text-black">Digital</span>
                <span className="text-primary-red">Dingo</span>
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-neutral-800 animate-slide-up">
                Creating stunning, high-performance websites tailored to your unique vision
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="font-heading text-5xl md:text-6xl text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Providing digital solutions for
            <br />
            <span className="text-primary-red">unique visions</span>
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
          >
            {[
              {
                title: 'Web Design & Development',
                description: 'Modern, responsive websites built to your specifications with attention to detail and performance',
                icon: Globe2
              },
              {
                title: 'UI/UX Design',
                description: 'Intuitive user experiences and stunning interfaces that engage your audience',
                icon: Palette
              },
              {
                title: 'Digital Marketing',
                description: 'Strategic campaigns to boost your online presence and reach your target audience',
                icon: Megaphone
              },
              {
                title: 'Brand Development',
                description: 'Comprehensive brand strategies that tell your unique story',
                icon: Layers
              },
              {
                title: 'SEO Optimization',
                description: 'Enhance your online visibility with data-driven SEO strategies and performance optimization',
                icon: BarChart3
              },
              {
                title: 'Maintenance & Support',
                description: 'Ongoing website maintenance, updates, and technical support to keep your site running smoothly',
                icon: Wrench
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
              >
                <GradientCard>
                  <service.icon className="w-8 h-8 mb-4 text-black" />
                  <h3 className="font-heading text-2xl mb-4">{service.title}</h3>
                  <p className="text-neutral-700">{service.description}</p>
                </GradientCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-32">
        <div className="relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl mb-16 text-center">
            Our <span className="text-primary-red">Process</span>
          </h2>
          
          <div className="relative">
            <div className="flex space-x-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide pl-[5vw]">
              {[
                {
                  title: 'Discovery Phase',
                  description: 'We begin by understanding your vision, goals, and requirements through detailed consultation. This foundation ensures we create exactly what you need.',
                  icon: Search
                },
                {
                  title: 'Strategy & Design',
                  description: 'Creating comprehensive wireframes and design concepts that align perfectly with your brand identity and business objectives.',
                  icon: Pencil
                },
                {
                  title: 'Development',
                  description: 'Building your website with clean, efficient code and optimal performance. We focus on creating scalable, future-proof solutions.',
                  icon: Code2
                },
                {
                  title: 'Quality Assurance',
                  description: 'Rigorous testing across all devices and browsers to ensure a flawless user experience and perfect functionality.',
                  icon: TestTube
                },
                {
                  title: 'Launch & Support',
                  description: 'Smooth deployment of your website followed by dedicated ongoing support and maintenance to ensure continued success.',
                  icon: Rocket
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="flex-none snap-center w-[85vw] md:w-[45vw] lg:w-[30vw] h-[400px]"
                >
                  <GradientCard className="h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-center w-16 h-16 
                        rounded-full bg-primary-sand mb-6 shrink-0">
                        <step.icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="font-heading text-2xl mb-4 text-black shrink-0">
                        {step.title}
                      </h3>
                      <p className="text-neutral-700 leading-relaxed overflow-y-auto">
                        {step.description}
                      </p>
                    </div>
                  </GradientCard>
                </motion.div>
              ))}
            </div>
            
            {/* Scroll hint */}
            <div className="absolute right-4 bottom-0 flex items-center text-sm text-neutral-500">
              <span className="mr-2">Scroll</span>
              <svg 
                className="w-4 h-4 animate-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <LatestProjects />

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
              Let&apos;s create something extraordinary together. From concept to launch,
              we&apos;ll bring your digital vision to life with precision and creativity.
            </p>
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
          </div>
        </motion.div>
      </section>
    </PageWithFlow>
  )
}
