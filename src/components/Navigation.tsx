'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { IndigenousFigure } from './icons/IndigenousFigure'
import { X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' }
]

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    console.log('Navigation: isOpen state changed to:', isOpen)
  }, [isOpen])

  return (
    <>
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <IndigenousFigure className="w-12 h-12 text-ochre-500" />
            <div className="flex flex-col">
              <span className="text-[1.7rem] leading-none">Digital</span>
              <span className="text-[1.7rem] font-bold leading-none">Dingo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-neutral-800 hover:text-primary-ochre transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              console.log('Navigation: Button clicked, current state:', isOpen)
              setIsOpen(!isOpen)
            }}
            className="md:hidden p-4"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <div className="w-8 h-8 flex flex-col justify-around">
                <span className="block w-8 h-0.5 bg-black" />
                <span className="block w-8 h-0.5 bg-black" />
                <span className="block w-8 h-0.5 bg-black" />
              </div>
            )}
          </button>
        </nav>
      </header>

      <MobileMenu 
        isOpen={isOpen}
        onClose={() => {
          console.log('Navigation: onClose called')
          setIsOpen(false)
        }}
        links={links}
      />
    </>
  )
}

export { Navigation }
export default Navigation 