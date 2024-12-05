'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const ChatPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 right-8 max-w-xs"
        >
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 p-4 rounded-2xl shadow-lg">
            <div className="relative">
              <div className="text-white text-sm">
                Need some help or want to speak to someone?
              </div>
              <div 
                className="absolute -bottom-3 right-0 w-4 h-4 bg-orange-600 transform rotate-45"
                style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 