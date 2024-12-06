import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
  keywords?: string
}

export function SEO({
  title = 'DigitalDingo | Indigenous-Inspired Web Design & Development',
  description = 'Professional web design company blending Australian Indigenous aesthetics with modern web development. Creating unique, culturally-inspired digital experiences.',
  image = '/images/og-image.jpg',
  article = false,
  keywords = 'web design, indigenous design, australian web development, digital agency, web development company'
}: SEOProps) {
  const router = useRouter()
  const canonical = `https://digitaldingo.uk${router.asPath}`
  const siteName = 'DigitalDingo'

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={article ? 'article' : 'website'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'DigitalDingo',
            url: 'https://digitaldingo.uk',
            logo: 'https://digitaldingo.uk/images/logo.png',
            description: description,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'UK'
            }
          })
        }}
      />
    </Head>
  )
} 