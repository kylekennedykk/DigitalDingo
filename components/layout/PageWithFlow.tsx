'use client'

import { ReactNode } from 'react'
import DreamtimeFlow from '../DreamtimeFlow'

interface PageWithFlowProps {
  children: ReactNode
  className?: string
  variant?: 'dark' | 'light'
  opacity?: number
}

export function PageWithFlow({ 
  children, 
  className = '',
  variant = 'light',
  opacity = 1
}: PageWithFlowProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <DreamtimeFlow 
        className="absolute inset-0 -z-10" 
        variant={variant}
        opacity={opacity}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
