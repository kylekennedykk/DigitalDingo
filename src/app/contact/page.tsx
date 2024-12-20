'use client'

import { useEffect } from 'react'
import { ContactForm } from '@/components/ContactForm'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Mail, Phone, Clock } from 'lucide-react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'

export default function ContactPage() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow('absolute inset-0 bg-transparent')
  }, [showFlow])

  return (
    <main className="min-h-screen">
      {/* Contact Form Section */}
      <section className="relative min-h-screen">
        <div className="relative min-h-screen bg-transparent backdrop-blur-sm bg-white/30">
          <div className="container relative z-10 pt-24 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-black">
                Get in Touch
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Have a project in mind? We&apos;d love to hear about it. Send us a message and we&apos;ll get back to you as soon as possible.
              </p>
            </motion.div>

            <Suspense fallback={<div>Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-neutral-900 text-white py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Email */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-heading text-xl mb-2">Email Us</h3>
              <a 
                href="mailto:hello@digitaldingo.uk"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                hello@digitaldingo.uk
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-heading text-xl mb-2">Call Us</h3>
              <a 
                href="tel:+447954757626"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                +44 7954 757 626
              </a>
            </div>

            {/* Business Hours */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-heading text-xl mb-2">Business Hours</h3>
              <p className="text-neutral-300">
                Monday - Friday<br />
                9:00 AM - 5:00 PM GMT
              </p>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-24 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl mb-6 text-white">
              Let&apos;s Create Something Amazing
            </h2>
            <p className="text-neutral-300 mb-8">
              Whether you&apos;re starting from scratch or looking to revamp your existing digital presence, 
              we&apos;re here to help turn your vision into reality. Get in touch and let&apos;s start the conversation.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 