'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'

interface PageWithFlowProps {
  children: React.ReactNode
  opacity?: number
}

export function PageWithFlow({ children, opacity = 0.8 }: PageWithFlowProps) {
  const pathname = usePathname()
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow(`absolute inset-0 w-full h-full opacity-${opacity * 100}`)
  }, [showFlow, opacity, pathname])

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 