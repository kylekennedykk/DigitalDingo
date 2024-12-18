'use client'

import { useEffect } from 'react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'

export function HeroSection() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow('fixed inset-0 -z-10')
  }, [showFlow])

  return (
    <section>
      {/* Your hero content */}
    </section>
  )
} 