// components/ClientStyledWrapper.tsx
"use client";

import { Theme } from '@/types/theme'

interface ClientStyledWrapperProps {
  theme: Theme
  children: React.ReactNode
}

export default function ClientStyledWrapper({ theme, children }: ClientStyledWrapperProps) {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body
      }}
    >
      {children}
      <style jsx global>{`
        .font-heading {
          font-family: ${theme.fonts.heading}, system-ui;
        }
        .text-primary {
          color: ${theme.colors.primary};
        }
        .bg-primary {
          background-color: ${theme.colors.primary};
        }
        .text-secondary {
          color: ${theme.colors.secondary};
        }
        .bg-secondary {
          background-color: ${theme.colors.secondary};
        }
        .text-accent {
          color: ${theme.colors.accent};
        }
        .bg-accent {
          background-color: ${theme.colors.accent};
        }
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --accent-color: ${theme.colors.accent};
          --background-color: ${theme.colors.background};
          --text-color: ${theme.colors.text};
        }
      `}</style>
    </div>
  )
}