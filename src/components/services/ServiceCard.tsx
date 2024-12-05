'use client'

import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  service: {
    title: string
    description: string
    icon: LucideIcon
    features: string[]
  }
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl border border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="mb-4 inline-block rounded-full bg-white/20 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="mb-3 text-2xl font-bold text-white">
          {service.title}
        </h3>
        
        <p className="mb-4 text-white/90">
          {service.description}
        </p>
        
        <ul className="space-y-2">
          {service.features.map((feature, index) => (
            <li 
              key={index}
              className="flex items-center text-white/80"
            >
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-white" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 