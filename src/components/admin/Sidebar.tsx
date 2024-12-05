'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Users, Info, Grid, ExternalLink, BarChart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    {
      href: '/admin/contacts',
      icon: Users,
      label: 'Contact Submissions'
    },
    {
      href: '/admin/chat-history',
      icon: MessageSquare,
      label: 'Chat History'
    },
    {
      href: '/admin/about',
      icon: Info,
      label: 'About'
    },
    {
      href: '/admin/portfolio',
      icon: Grid,
      label: 'Portfolio Sites'
    },
    {
      href: '/admin/external',
      icon: ExternalLink,
      label: 'External Portfolio'
    },
    {
      href: '/admin/analytics',
      icon: BarChart,
      label: 'Analytics'
    }
  ]

  return (
    <nav className="w-64 bg-white border-r h-screen">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 px-6 py-4 hover:bg-neutral-50 transition-colors",
            pathname === link.href && "bg-neutral-100"
          )}
        >
          <link.icon className="w-5 h-5" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  )
} 