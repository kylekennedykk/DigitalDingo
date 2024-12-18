'use client'

import dynamic from 'next/dynamic'

const AIChatBox = dynamic(() => import('@/components/AIChatBox').then(mod => mod.AIChatBox), {
  loading: () => <div className="fixed bottom-4 right-4 w-12 h-12 bg-gray-200 rounded-full animate-pulse" />,
  ssr: false
})

const Navigation = dynamic(() => import('@/components/Navigation').then(mod => mod.Navigation), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />,
  ssr: false
})

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer), {
  loading: () => <div className="h-24 bg-gray-100 animate-pulse" />
})

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <AIChatBox />
    </>
  )
} 