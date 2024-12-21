import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { Metadata } from 'next'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Suspense } from 'react'
import { LoadingPage } from '@/components/ui/loading-states'
import { DreamtimeFlowProvider } from '@/lib/contexts/DreamtimeFlowContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DigitalDingo',
  description: 'Indigenous-Inspired Web Design Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={<LoadingPage />}>
          <DreamtimeFlowProvider>
            <Providers>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Providers>
          </DreamtimeFlowProvider>
        </Suspense>
      </body>
    </html>
  )
}
