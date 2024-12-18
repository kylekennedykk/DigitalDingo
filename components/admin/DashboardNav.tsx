import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  FolderKanban,
  Settings
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Chat History',
    href: '/admin/chats',
    icon: MessageSquare
  },
  {
    title: 'Clients',
    href: '/admin/clients',
    icon: Users
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-primary-ochre text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5 mr-3',
              isActive ? 'text-white' : 'text-neutral-400'
            )} />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 