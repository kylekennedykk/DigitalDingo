'use client'

interface PageWithFlowProps {
  children: React.ReactNode
  variant?: 'light' | 'dark'
  opacity?: number
}

export function PageWithFlow({ 
  children, 
  variant = 'light',
  opacity = 1 
}: PageWithFlowProps) {
  return (
    <main className={`relative min-h-screen ${
      variant === 'dark' ? 'text-white' : 'text-black'
    }`}>
      {children}
    </main>
  )
}
