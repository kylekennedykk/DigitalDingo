'use client'

import React, { useEffect } from 'react'
import { useDreamtimeFlow } from '@/lib/contexts/DreamtimeFlowContext'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { 
  Globe2, 
  Palette, 
  Megaphone, 
  Layers, 
  Search, 
  Pencil, 
  Code2, 
  TestTube, 
  Rocket,
  BarChart3,
  Wrench
} from 'lucide-react'
import { GradientCard } from '@/components/GradientCard'
import { PageWithFlow } from '@/components/layout/PageWithFlow'
import dynamic from 'next/dynamic'

const LatestProjects = dynamic(
  () => import('@/components/LatestProjects').then(mod => mod.LatestProjects),
  {
    loading: () => <div className="h-[600px]" />
  }
)

export default function HomePage() {
  const { showFlow } = useDreamtimeFlow()

  useEffect(() => {
    showFlow('fixed inset-0 -z-10')
  }, [showFlow])

  return (
    <PageWithFlow variant="dark" opacity={0.8}>
      {/* Rest of your page content */}
    </PageWithFlow>
  )
}
