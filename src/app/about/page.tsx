import { AboutContent } from '@/components/about/AboutContent'
import { Metadata } from 'next'

// You can add static metadata here as well
export const metadata: Metadata = {
  title: 'About DigitalDingo | Indigenous-Inspired Web Design Agency',
  description: 'Learn about DigitalDingo\'s mission to blend Australian Indigenous art with modern web design.',
}

const mockData = {
  content: '', // Will use defaultContent from AboutContent
  team: [
    {
      id: '1',
      name: 'John Doe',
      role: 'Creative Director',
      photo: '/images/team/john-doe.jpg',
      bio: 'John brings over 15 years of experience in digital design...',
    },
    // Add more team members as needed
  ]
}

export default function AboutPage() {
  return <AboutContent initialData={mockData} />
} 