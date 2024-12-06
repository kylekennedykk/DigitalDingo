import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AIChatBox } from '@/components/AIChatBox'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { Metadata } from 'next'
import 'mapbox-gl/dist/mapbox-gl.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading'
})

export const metadata: Metadata = {
  title: 'DigitalDingo | Web Design & Development',
  description: 'Professional web design and development services by DigitalDingo. We create stunning, high-performance websites with modern technology and creative design.',
  keywords: 'web design, web development, digital agency, UK web design, responsive design, ecommerce websites, web applications, SEO services',
  authors: [{ name: 'DigitalDingo' }],
  creator: 'DigitalDingo',
  publisher: 'DigitalDingo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://digitaldingo.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DigitalDingo | Web Design & Development',
    description: 'Professional web design and development services by DigitalDingo. We create stunning, high-performance websites with modern technology and creative design.',
    url: 'https://digitaldingo.uk',
    siteName: 'DigitalDingo',
    images: [
      {
        url: '/og-image.jpg', // Make sure to create this image
        width: 1200,
        height: 630,
        alt: 'DigitalDingo - Web Design & Development',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigitalDingo | Web Design & Development',
    description: 'Professional web design and development services by DigitalDingo',
    images: ['/og-image.jpg'], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DigitalDingo",
              "url": "https://digitaldingo.uk",
              "logo": "https://digitaldingo.uk/logo.png",
              "sameAs": [
                "https://twitter.com/digitaldingo",
                "https://www.linkedin.com/company/digitaldingo",
                // Add other social media URLs
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "your-phone",
                "contactType": "customer service",
                "email": "hello@digitaldingo.uk",
                "areaServed": "GB"
              }
            })
          }}
        />
      </head>
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
