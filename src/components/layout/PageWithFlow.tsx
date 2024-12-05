'use client'

import { DreamtimeFlow } from '@/components/DreamtimeFlow'
import { usePathname } from 'next/navigation'

interface PageWithFlowProps {
  children: React.ReactNode
  opacity?: number
  variant?: 'light' | 'dark'
}

export function PageWithFlow({ children, opacity = 0.8, variant = 'dark' }: PageWithFlowProps) {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full opacity-80">
        <DreamtimeFlow key={pathname} variant={variant} />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 