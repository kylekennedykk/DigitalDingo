'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import { useChat, Message } from 'ai/react'

export const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  
  // Keep your existing chat initialization logic
  const handleOpen = () => {
    console.log('Opening chat...')
    setIsOpen(true)
    setShowPrompt(false)
    // Keep your existing initialization code
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPrompt(true)
      }
    }, 5000) // 5 seconds for testing

    return () => clearTimeout(timer)
  }, [isOpen])

  return (
    <>
      {/* Prompt Bubble */}
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 max-w-xs z-50"
          >
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="relative">
                <div className="text-gray-800 text-sm">
                  Need some help or want to speak to someone?
                </div>
                <div 
                  className="absolute -bottom-2 right-4 w-3 h-3 bg-white transform rotate-45"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Keep your existing chat window implementation */}
    </>
  )
} 