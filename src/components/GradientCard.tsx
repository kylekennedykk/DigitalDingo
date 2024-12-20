'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientCardProps {
  className?: string
  children: React.ReactNode
}

export function GradientCard({ className, children }: GradientCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * -3
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 3

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'group relative h-full rounded-2xl bg-white shadow-lg',
        'before:absolute before:inset-0 before:rounded-2xl before:border before:border-neutral-200',
        'after:absolute after:inset-0 after:rounded-2xl after:opacity-0',
        'after:transition-opacity after:duration-300',
        'after:bg-gradient-to-br after:from-primary-ochre/20 after:via-primary-red/20 after:to-accent-purple/20',
        'hover:after:opacity-100',
        className
      )}
    >
      <div className="relative h-full w-full p-8 z-10">
        {children}
      </div>
    </motion.div>
  )
} 