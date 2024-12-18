import { notFound } from 'next/navigation'
import { getFirestore } from 'firebase-admin/firestore'
import app from '@/lib/firebase/admin'
import { themes } from '@/lib/themes'
import type { PortfolioSite, Section } from '@/types/portfolio'
import HeroSection from '@/components/sections/Hero'
import ContentSection from '@/components/sections/Content'
import GallerySection from '@/components/sections/Gallery'
import MenuSection from '@/components/sections/Menu'
import TestimonialsSection from '@/components/sections/Testimonials'
import TeamSection from '@/components/sections/Team'
import HoursSection from '@/components/sections/Hours'
import LocationSection from '@/components/sections/Location'
import FaqSection from '@/components/sections/Faq'
import ClientStyledWrapper from '@/components/ClientStyledWrapper'

export async function generateStaticParams() {
  const db = getFirestore(app)
  const sitesSnapshot = await db
    .collection('portfolio-sites')
    .where('status', '==', 'published')
    .get()

  return sitesSnapshot.docs.map(doc => ({
    slug: doc.data().slug
  }))
}

async function getSite(slug: string): Promise<PortfolioSite | null> {
  const db = getFirestore(app)
  
  const siteSnapshot = await db
    .collection('portfolio-sites')
    .where('slug', '==', slug)
    .where('status', '==', 'published')
    .limit(1)
    .get()

  if (siteSnapshot.empty) return null

  const siteDoc = siteSnapshot.docs[0]
  const siteData = siteDoc.data()

  const sectionsSnapshot = await db
    .collection('portfolio-sites')
    .doc(siteDoc.id)
    .collection('sections')
    .orderBy('order')
    .get()

  const sections = sectionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Section[]

  return {
    id: siteDoc.id,
    ...siteData,
    sections
  } as PortfolioSite
}

export default async function PortfolioSitePage({ params }: { params: { slug: string } }) {
  const site = await getSite(params.slug)

  if (!site) {
    notFound()
  }

  const theme = themes[site.theme || 'default']

  return (
    <ClientStyledWrapper theme={theme}>
      {site.sections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} content={section.content} settings={section.settings} />
          case 'content':
            return <ContentSection key={section.id} content={section.content} settings={section.settings} />
          case 'gallery':
            return <GallerySection key={section.id} content={section.content} settings={section.settings} />
          case 'menu':
            return <MenuSection key={section.id} content={section.content} settings={section.settings} />
          case 'testimonials':
            return <TestimonialsSection key={section.id} content={section.content} settings={section.settings} />
          case 'team':
            return <TeamSection key={section.id} content={section.content} settings={section.settings} />
          case 'hours':
            return <HoursSection key={section.id} content={section.content} settings={section.settings} />
          case 'location':
            return <LocationSection key={section.id} content={section.content} settings={section.settings} />
          case 'faq':
            return <FaqSection key={section.id} content={section.content} settings={section.settings} />
          default:
            return null
        }
      })}
    </ClientStyledWrapper>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = await getSite(params.slug)

  if (!site) {
    return {
      title: 'Site Not Found | DigitalDingo Portfolio',
      description: 'The requested portfolio site could not be found.'
    }
  }

  return {
    title: `${site.name} | DigitalDingo Portfolio`,
    description: site.description || `A portfolio site created by DigitalDingo`,
    openGraph: {
      title: site.name,
      description: site.description,
      images: site.thumbnail ? [site.thumbnail] : [],
      type: 'website',
    },
  }
}