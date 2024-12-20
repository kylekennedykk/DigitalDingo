'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Don't render if no src provided
  if (!src) {
    return null
  }

  return (
    <div 
      className="relative"
      style={{ 
        contain: 'layout',
        contentVisibility: 'auto'
      }}
    >
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`} />
      )}
      <Image
        src={error ? '/images/fallback.jpg' : src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
} 