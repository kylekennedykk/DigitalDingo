import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AIChatBox } from '@/components/AIChatBox'
import { AuthProvider } from '@/lib/contexts/AuthContext'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading'
})

export const metadata = {
  title: 'DigitalDingo | Indigenous-Inspired Web Design & Development',
  description: 'Professional web design services with Australian Indigenous-inspired aesthetics, combining traditional art with modern technology.',
  keywords: 'web design, Indigenous art, Australian web design, digital agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-neutral-100 text-neutral-900">
        <AuthProvider>
          <Navigation />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
          <AIChatBox />
        </AuthProvider>
      </body>
    </html>
  )
}
