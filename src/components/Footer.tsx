import { DreamtimeFlow } from './DreamtimeFlow'
import Link from 'next/link'
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { IndigenousFigure } from './icons/IndigenousFigure'

export function Footer() {
  return (
    <footer className="relative bg-neutral-900 text-white">
      <div className="absolute inset-0">
        <DreamtimeFlow variant="dark" />
      </div>
      <div className="container relative z-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and About Section */}
          <div className="space-y-6">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 group"
              aria-label="Digital Dingo Home"
            >
              <IndigenousFigure className="w-10 h-10 fill-white group-hover:text-ochre-400 transition-colors duration-300" />
              <div className="flex flex-col h-10 justify-center gap-[1px]">
                <span className="text-2xl leading-none text-white">Digital</span>
                <span className="text-2xl font-bold leading-none text-white">Dingo</span>
              </div>
            </Link>
            <p className="text-neutral-300 leading-relaxed">
              Crafting high-performance websites and digital solutions for businesses across the UK and beyond.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
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
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
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

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="font-heading text-xl mb-6">Connect With Us</h4>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center
                    hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400">
              &copy; {new Date().getFullYear()} DigitalDingo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-400">
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