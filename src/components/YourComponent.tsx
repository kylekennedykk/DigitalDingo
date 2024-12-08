'use client'

import { useEffect } from 'react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'

export function YourComponent() {
  const { showFlow } = useDreamtimeFlow()
  
  useEffect(() => {
    showFlow('your-custom-class')
  }, [showFlow])
  
  return (
    <div>
      {/* Your content here */}
    </div>
  )
} 