'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CustomCursorProps {
  svgPath?: string
}

export function CustomCursor({ svgPath }: CustomCursorProps) {
  const [visible, setVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 20, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)
    }

    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      setVisible(true)
      window.addEventListener('mousemove', moveCursor)
      document.body.style.cursor = 'none'
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.style.cursor = 'auto'
    }
  }, [cursorX, cursorY])

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
    return null
  }

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Main cursor shape */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-[9999]"
      >
        {/* Black outline */}
        <path
          d={svgPath}
          stroke="black"
          strokeWidth="3"
          fill="none"
        />
        {/* White inner stroke */}
        <path
          d={svgPath}
          stroke="white"
          strokeWidth="1.5"
          fill="rgba(255, 255, 255, 0.2)"
        />
      </motion.svg>

      {/* Glow effect */}
      <div
        className="absolute inset-0 bg-white/10 blur-[4px]"
        style={{
          clipPath: 'path("' + svgPath + '")',
          transform: 'scale(1.1)',
        }}
      />
    </motion.div>
  )
} 