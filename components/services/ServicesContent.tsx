'use client'

import { motion, Variants } from 'framer-motion'
import ServiceCard from '@/components/services/ServiceCard'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'
import { useEffect } from 'react'
import { 
  Globe2, 
  Palette, 
  Code2, 
  BarChart3, 
  Wrench,
  Cpu
} from 'lucide-react'

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

const servicesData = [
  {
    id: 1,
    title: 'Web Design & Development',
    description: 'Beautiful, responsive websites that work perfectly on all devices.',
    icon: Globe2,
    features: [
      'Custom Design',
      'Mobile Responsive',
      'Fast Loading',
      'SEO Ready'
    ]
  },
  {
    id: 2,
    title: 'UI/UX Design',
    description: 'User-friendly interfaces that look great and work even better.',
    icon: Palette,
    features: [
      'Modern Design',
      'Easy Navigation',
      'Brand Focused',
      'User Testing'
    ]
  },
  {
    id: 3,
    title: 'Technical Solutions',
    description: 'Custom features and integrations to make your website work harder.',
    icon: Code2,
    features: [
      'Custom Features',
      'Third-party Integration',
      'Payment Systems',
      'Content Management'
    ]
  },
  {
    id: 4,
    title: 'Performance Optimization',
    description: 'Make your website faster and more efficient.',
    icon: BarChart3,
    features: [
      'Speed Optimization',
      'Mobile Performance',
      'Search Rankings',
      'Analytics Setup'
    ]
  },
  {
    id: 5,
    title: 'AI Integration',
    description: 'Smart features to enhance your website\'s capabilities.',
    icon: Cpu,
    features: [
      'AI Chat Support',
      'Smart Search',
      'Content Automation',
      'User Insights'
    ]
  },
  {
    id: 6,
    title: 'Maintenance & Support',
    description: 'Keep your website running smoothly with ongoing support.',
    icon: Wrench,
    features: [
      'Regular Updates',
      'Security Checks',
      'Content Updates',
      'Technical Support'
    ]
  }
]

export default function ServicesContent() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow('absolute inset-0 opacity-60')
  }, [showFlow])

  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-50 to-ochre-50">
      <section className="relative py-32">
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center"
            >
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                Our Services
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl mb-4 text-white">
                  Transforming digital visions into exceptional experiences
                </p>
                <p className="text-base md:text-lg text-white">
                  From stunning designs to powerful functionality, we offer comprehensive web solutions 
                  that help businesses stand out in the digital landscape.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
          >
            {servicesData.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeIn}
                className="transform hover:-translate-y-1 transition-all duration-300"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
} 