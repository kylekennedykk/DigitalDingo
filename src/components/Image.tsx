'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Image({ 
  src, 
  alt,
  className,
  ...props 
}: React.ComponentProps<typeof NextImage>) {
  const [isLoading, setLoading] = useState(true)

  return (
    <NextImage
      className={cn(
        'duration-700 ease-in-out',
        isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0',
        className
      )}
      src={src}
      alt={alt}
      quality={90}
      onLoadingComplete={() => setLoading(false)}
      {...props}
    />
  )
} 