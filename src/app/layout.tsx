import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Suspense } from 'react'
import { LoadingPage } from '@/components/ui/loading-states'
import dynamic from 'next/dynamic'

const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then(mod => mod.ClientLayout),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
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
          <Providers>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
