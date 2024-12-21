'use client'

import React from 'react'

interface PageWithFlowProps {
  children: React.ReactNode
  variant?: 'light' | 'dark'
  opacity?: number
}

const PageWithFlow: React.FC<PageWithFlowProps> = ({
  children,
  variant = 'light',
  opacity = 0.5
}) => {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  )
}

export default PageWithFlow
