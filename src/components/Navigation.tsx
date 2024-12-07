'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { theme } from '@/lib/theme'
import { IndigenousFigure } from './icons/IndigenousFigure'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' }
  ]

  useEffect(() => {
    setIsScrolled(window.scrollY > 10)

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`
      fixed w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-transparent backdrop-blur-sm'}
    `}
      style={{ contain: 'layout paint' }}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between"
        style={{ contain: 'content' }}
      >
        <Link 
          href="/" 
          className="flex items-center gap-1.5 group"
          aria-label="Digital Dingo Home"
          style={{ contain: 'layout' }}
        >
          <IndigenousFigure className="w-12 h-12 text-ochre-500 group-hover:text-ochre-600 transition-colors duration-300" />
          <div className="flex flex-col h-12 justify-center gap-[1px]">
            <span className="text-[1.7rem] leading-none text-neutral-900">Digital</span>
            <span className="text-[1.7rem] font-bold leading-none text-neutral-900">Dingo</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8"
          style={{ contain: 'layout' }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-medium text-neutral-800 hover:text-primary-ochre transition-colors
                before:absolute before:-bottom-1 before:h-0.5 before:w-full before:origin-left
                before:scale-x-0 before:bg-primary-ochre before:transition-transform
                hover:before:scale-x-100"
              style={{ contain: 'paint' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ contain: 'layout paint' }}
        >
          <span className="sr-only">Menu</span>
          {/* Hamburger icon */}
          <div className="w-6 h-6 flex flex-col justify-around">
            <span className="w-full h-0.5 bg-neutral-900 transition-transform" />
            <span className="w-full h-0.5 bg-neutral-900 transition-transform" />
            <span className="w-full h-0.5 bg-neutral-900 transition-transform" />
          </div>
        </button>
      </nav>
    </header>
  )
} 