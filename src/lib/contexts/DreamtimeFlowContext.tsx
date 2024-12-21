'use client'

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'
import { DreamtimeFlow } from '@/components/DreamtimeFlow'

interface DreamtimeFlowContextType {
  showFlow: (className: string) => void
  hideFlow: () => void
  isVisible: boolean
}

const DreamtimeFlowContext = createContext<DreamtimeFlowContextType | null>(null)

export function DreamtimeFlowProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [className, setClassName] = useState('fixed inset-0 -z-10')
  const [key, setKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showFlow = useCallback((newClassName: string) => {
    setClassName(newClassName)
    setIsVisible(true)
    setKey(prev => prev + 1)
  }, [])

  const hideFlow = useCallback(() => {
    setIsVisible(false)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DreamtimeFlowContext.Provider value={{ showFlow, hideFlow, isVisible }}>
      {isVisible && mounted && (
        <DreamtimeFlow 
          key={key} 
          className={className} 
        />
      )}
      {children}
    </DreamtimeFlowContext.Provider>
  )
}

export function useDreamtimeFlow() {
  const context = useContext(DreamtimeFlowContext)
  if (!context) {
    throw new Error('useDreamtimeFlow must be used within a DreamtimeFlowProvider')
  }
  return context
} 