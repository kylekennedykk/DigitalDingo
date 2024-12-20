
'use client'

interface PageWithFlowProps {
  children: React.ReactNode
  opacity?: number
  variant?: 'dark' | 'light'
}

export function PageWithFlow({ 
  children
}: PageWithFlowProps) {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
