'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, Clock } from 'lucide-react'
import { IndigenousFigure } from './icons/IndigenousFigure'

export function Footer() {
  const [localTime, setLocalTime] = useState<string>('')

  useEffect(() => {
    const updateLocalTime = () => {
      const time = new Date().toLocaleString("en-US", {
        timeZone: "Europe/London",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
      setLocalTime(time);
    };

    updateLocalTime();
    const interval = setInterval(updateLocalTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-black text-white" style={{ contain: 'layout paint' }}>
      <div className="container relative pt-20 pb-12" style={{ contain: 'content' }}>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 mb-16" style={{ contentVisibility: 'auto' }}>
          {/* Logo and About Section */}
          <div className="space-y-8 lg:col-span-5" style={{ contain: 'layout paint' }}>
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Digital Dingo Home">
              <IndigenousFigure className="w-14 h-14 fill-white group-hover:text-ochre-400 transition-colors duration-300" />
              <div className="flex flex-col justify-center gap-[1px]">
                <span className="text-3xl leading-none text-white">Digital</span>
                <span className="text-3xl font-bold leading-none text-white">Dingo</span>
              </div>
            </Link>
            <p className="text-neutral-300 leading-relaxed">
              <span className="max-w-md block">
                Crafting high-performance websites and digital solutions for businesses across the UK and beyond.
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 lg:col-span-2" style={{ contain: 'layout paint' }}>
            <h4 className="font-heading text-xl mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { href: '/services', label: 'Services' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' }
              ].map(link => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="block text-neutral-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 lg:col-span-3" style={{ contain: 'layout paint' }}>
            <h4 className="font-heading text-xl mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a 
                href="mailto:hello@digitaldingo.uk" 
                className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                hello@digitaldingo.uk
              </a>
              <a 
                href="tel:+447954757626" 
                className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                +44 7954 757 626
              </a>
              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="w-5 h-5" />
                <div className="space-y-1">
                  <p>Monday - Friday</p>
                  <p>9:00 AM - 5:00 PM GMT</p>
                  {localTime && (
                    <p className="text-sm text-neutral-400">
                      (Your local time: {localTime})
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-neutral-800" style={{ contain: 'layout paint' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4" style={{ contain: 'content' }}>
            <p className="text-neutral-400">
              &copy; {new Date().getFullYear()} DigitalDingo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-400" style={{ contain: 'layout' }}>
              <Link href="/privacy" className="hover:text-primary-ochre transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-ochre transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 