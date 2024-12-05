export interface PortfolioSite {
  id: string
  name: string
  slug: string
  status: 'draft' | 'published'
  theme: string
  description?: string
  thumbnail?: string
  tags?: string[]
  featured?: boolean
  createdAt: string
  updatedAt: string
  sections: Section[]
  settings: SiteSettings & {
    theme?: Partial<Theme>
  }
}

export interface SiteSettings {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  logo?: string
  favicon?: string
}

export interface Section {
  id: string
  type: 
    | 'hero' 
    | 'content' 
    | 'gallery' 
    | 'contact'
    | 'features'
    | 'menu'          // For restaurants/cafes
    | 'testimonials'  // Customer reviews
    | 'team'          // Staff/team members
    | 'services'      // Service listings
    | 'pricing'       // Price tables
    | 'hours'         // Business hours
    | 'location'      // Map and address
    | 'cta'           // Call to action
    | 'products'      // Product showcase
    | 'faq'           // FAQ accordion
  order: number
  content: SectionContent
  settings: SectionSettings
}

export interface SectionContent {
  title?: string
  subtitle?: string
  text?: string
  images?: string[]
  buttons?: {
    text: string
    url: string
    style: 'primary' | 'secondary'
  }[]
  [key: string]: any // For section-specific content
}

export interface SectionSettings {
  backgroundColor?: string
  textColor?: string
  padding?: string
  layout?: 'full' | 'contained'
  [key: string]: any // For section-specific settings
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export interface ExternalPortfolioItem {
  id: string
  name: string
  description?: string
  thumbnail?: string
  url: string
  tags?: string[]
  featured?: boolean
  published: boolean
  createdAt: string
  updatedAt: string
} 