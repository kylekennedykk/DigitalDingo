'use client'

import { useEffect, useState } from 'react'
import { PageWithFlow } from '@/components/layout/PageWithFlow'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import Image from 'next/image';

interface AboutContent {
  mainText: string
  mission: string
  vision: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl?: string
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch about content
        const aboutDoc = await getDoc(doc(db, 'content', 'about'))
        if (aboutDoc.exists()) {
          setContent(aboutDoc.data() as AboutContent)
        }

        // Fetch team members
        const teamSnapshot = await getDocs(collection(db, 'team'))
        const teamData = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[]
        setTeam(teamData.reverse())
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <PageWithFlow variant="dark" opacity={0.8}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 text-black">About DigitalDingo</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-black whitespace-pre-wrap">
                {content?.mainText}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-black">Our Mission</h2>
              <p className="text-lg text-black leading-relaxed">
                {content?.mission}
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-black">Our Vision</h2>
              <p className="text-lg text-black leading-relaxed">
                {content?.vision}
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-black">Our Team</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              {team.map((member) => (
                <div 
                  key={member.id}
                  className="flex flex-col items-center bg-white p-8 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  {member.imageUrl && (
                    <div className="mb-6">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-black font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-black leading-relaxed max-w-xl">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageWithFlow>
  )
} 