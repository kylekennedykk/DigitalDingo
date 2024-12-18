'use client'

import { useEffect } from 'react'
import { useDreamtimeFlow } from '../../lib/contexts/DreamtimeFlowContext'

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
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    console.log('PageWithFlow mounting, calling showFlow')
    showFlow('fixed inset-0 -z-10')
  }, [showFlow])

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
