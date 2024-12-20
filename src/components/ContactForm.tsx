'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ContactMetadata {
  timestamp: number
  userAgent: string
  language: string
  screenResolution: string
  timezone: string
  platform: string
  referrer: string
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  metadata: ContactMetadata
}

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      // Gather metadata
      const metadata: ContactMetadata = {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        referrer: document.referrer,
      }

      // Try to get location data
      try {
        const response = await fetch('https://ipapi.co/json/')
        const locationData = await response.json()
        metadata.location = {
          country: locationData.country_name,
          region: locationData.region,
          city: locationData.city,
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      }

      const contactData: ContactFormData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
        metadata,
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSuccess(true)
      form.reset()
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-lg text-sm">
          Thank you for getting in touch! We really appreciate you reaching out and will get back to you as soon as possible. Have a great day! 🦘
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-2 border-2 border-neutral-900 rounded-lg focus:ring-2 
            focus:ring-primary-ochre focus:border-primary-ochre transition-all outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border-2 border-neutral-900 rounded-lg focus:ring-2 
            focus:ring-primary-ochre focus:border-primary-ochre transition-all outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-2 border-2 border-neutral-900 rounded-lg focus:ring-2 
            focus:ring-primary-ochre focus:border-primary-ochre transition-all outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full px-4 py-2 border-2 border-neutral-900 rounded-lg focus:ring-2 
            focus:ring-primary-ochre focus:border-primary-ochre transition-all outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-4 bg-transparent text-neutral-900 rounded-full
          hover:bg-neutral-900 hover:text-white hover:scale-105
          transition-all duration-300 font-medium text-lg
          border-2 border-neutral-900
          shadow-lg hover:shadow-xl
          mx-auto block min-w-[200px]
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : (
          'Send Message'
        )}
      </button>
    </motion.form>
  )
} 