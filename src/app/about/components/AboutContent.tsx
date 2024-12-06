'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/Dialog'

interface TeamMember {
  id: string
  name: string
  role: string
  photo?: string
  description: string
}

interface AboutContentProps {
  initialData: {
    content: string
    team: TeamMember[]
  }
}

const defaultContent = `
  <p>
    At DigitalDingo, we draw inspiration from the rich tapestry of Australian Indigenous art and culture, 
    blending it seamlessly with cutting-edge web technology. Our name reflects our commitment to being 
    adaptable and resourceful – just like the dingo – while maintaining a deep connection to the cultural 
    heritage that makes Australia unique.
  </p>
  <p>
    We believe that great web design should tell a story, create connections, and respect the cultural 
    context it exists within. Our approach combines modern design principles with traditional Indigenous 
    art elements, creating digital experiences that are both innovative and culturally meaningful.
  </p>
  <p>
    Our mission is to bridge the gap between traditional storytelling and digital innovation, creating 
    websites that not only look beautiful but also carry meaning and purpose. We're committed to 
    sustainable, accessible, and culturally respectful design practices that benefit both our clients 
    and their communities.
  </p>
`

function formatDescription(text: string) {
  return text.split('\n').map((paragraph, index) => (
    paragraph.trim() && (
      <p key={index} className="text-neutral-600">
        {paragraph}
      </p>
    )
  ));
}

export function AboutContent({ initialData }: AboutContentProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const content = initialData.content || defaultContent

  return (
    <main className="py-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-24 text-center">
        <h1 className="font-heading text-4xl md:text-6xl mb-6">
          About <span className="text-primary-ochre">DigitalDingo</span>
        </h1>
      </section>

      {/* About Content */}
      <section className="container mx-auto px-4 mb-24">
        <div 
          className="max-w-3xl mx-auto prose prose-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4">
        <h2 className="font-heading text-3xl mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {initialData.team.map(member => (
            <div 
              key={member.id}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <Image
                  src={member.photo || '/images/placeholder-profile.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-heading text-xl mb-1">{member.name}</h3>
              <p className="text-neutral-600">{member.role}</p>
              <div className="space-y-2">
                {formatDescription(member.description)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Member Dialog */}
      <Dialog
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || ''}
      >
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={selectedMember?.photo || '/images/placeholder-profile.jpg'}
              alt={selectedMember?.name || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="font-heading text-xl">{selectedMember?.role}</h3>
          <div className="space-y-2">
            {formatDescription(selectedMember?.description || '')}
          </div>
        </div>
      </Dialog>
    </main>
  )
} 