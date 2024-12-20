'use client'

import dynamic from 'next/dynamic'

const ServicesContent = dynamic(() => import('@/components/services/ServicesContent'), {
  ssr: false
})

export function ServicesWrapper() {
  return <ServicesContent />
} 