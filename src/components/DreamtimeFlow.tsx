'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface DreamtimeFlowProps {
  className?: string
}

export function DreamtimeFlow({ className = 'fixed inset-0 -z-10' }: DreamtimeFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation variables
    let particles: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
    }> = []

    // Create particles
    const createParticles = () => {
      particles = []
      const numParticles = 100
      const colors = theme === 'dark' 
        ? ['#FF6B6B', '#4ECDC4', '#45B7D1'] 
        : ['#FFD93D', '#FF6B6B', '#4ECDC4']

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: 0.1 }}
    />
  )
} 