import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md',
  text,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span className="text-sm text-neutral-600">{text}</span>}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div 
      className="p-6 bg-white rounded-lg shadow-sm"
      style={{ 
        contain: 'content',
        contentVisibility: 'auto'
      }}
    >
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
} 