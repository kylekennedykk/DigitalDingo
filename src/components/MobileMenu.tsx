'use client'

import Link from 'next/link'
import { IndigenousFigure } from './icons/IndigenousFigure'
import { X } from 'lucide-react'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  links: Array<{ href: string; label: string }>
}

export const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  console.log('MobileMenu: Rendering with isOpen:', isOpen)

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[100] md:hidden"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="h-full flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-4"
          aria-label="Close menu"
        >
          <X className="w-8 h-8 text-black" />
        </button>

        <Link
          href="/"
          className="mb-12 flex flex-col items-center"
          onClick={onClose}
        >
          <IndigenousFigure className="w-24 h-24 text-ochre-500" />
          <div className="mt-4 flex items-center gap-1">
            <span className="text-3xl">Digital</span>
            <span className="text-3xl font-bold">Dingo</span>
          </div>
        </Link>

        <nav className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-medium text-neutral-900 hover:text-primary-ochre transition-colors"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 