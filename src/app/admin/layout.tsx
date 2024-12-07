'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MessageSquare, 
  LayoutGrid, 
  BarChart3, 
  LogOut,
  Loader2,
  ExternalLink,
  Users,
  MessagesSquare
} from 'lucide-react'
import { Suspense } from 'react'
import { LoadingPage } from '@/components/ui/loading-states'

const menuItems = [
  {
    title: 'Contact Submissions',
    href: '/admin/contacts',
    icon: MessageSquare
  },
  {
    title: 'Chat History',
    href: '/admin/chat-history',
    icon: MessagesSquare
  },
  {
    title: 'About',
    href: '/admin/about-content',
    icon: Users
  },
  {
    title: 'Portfolio Sites',
    href: '/admin/portfolio',
    icon: LayoutGrid
  },
  {
    title: 'External Portfolio',
    href: '/admin/external-portfolio',
    icon: ExternalLink
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') {
    router.push('/admin/login')
    return null
  }

  if (pathname === '/admin/login') {
    return children
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="min-h-screen flex pt-16">
        <aside 
          className="w-64 bg-white border-r shrink-0"
          style={{ contain: 'layout paint' }}
        >
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <nav className="p-4 space-y-1 flex-grow">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </Suspense>
  )
} 