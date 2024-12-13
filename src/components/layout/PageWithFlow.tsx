
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'

interface PageWithFlowProps {
  children: React.ReactNode
  opacity?: number
  variant?: 'dark' | 'light'
}

export function PageWithFlow({ 
  children, 
  opacity = 0.8,
  variant = 'light' 
}: PageWithFlowProps) {
  const pathname = usePathname()
  const { showFlow } = useDreamtimeFlow()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const opacityValue = Math.round(opacity * 100)
    const className = `absolute inset-0 w-full h-full opacity-${opacityValue}`
    showFlow(className)
  }, [showFlow, opacity, pathname])

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
