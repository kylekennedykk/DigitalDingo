'use client'

import Script from 'next/script'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'DigitalDingo',
  'url': 'https://digitaldingo.uk',
  'description': 'Professional web design and development services by DigitalDingo',
  'logo': 'https://digitaldingo.uk/logo.png',
  'sameAs': [
    'https://twitter.com/digitaldingo',
    'https://www.linkedin.com/company/digitaldingo',
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'customer service',
    'email': 'hello@digitaldingo.uk',
    'areaServed': 'GB'
  }
}

export function JsonLd() {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd)
      }}
    />
  )
} 