'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { DreamtimeFlow } from '@/components/DreamtimeFlow'

interface DreamtimeFlowContextType {
  showFlow: (className: string) => void
  hideFlow: () => void
  isVisible: boolean
}

const DreamtimeFlowContext = createContext<DreamtimeFlowContextType | null>(null)

export function DreamtimeFlowProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [className, setClassName] = useState('fixed inset-0 -z-10')
  const [key, setKey] = useState(0)

  const showFlow = useCallback((newClassName: string) => {
    setClassName(newClassName)
    setIsVisible(true)
    setKey(prev => prev + 1)
  }, [])

  const hideFlow = useCallback(() => {
    setIsVisible(false)
  }, [])

  return (
    <DreamtimeFlowContext.Provider value={{ showFlow, hideFlow, isVisible }}>
      {isVisible && (
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