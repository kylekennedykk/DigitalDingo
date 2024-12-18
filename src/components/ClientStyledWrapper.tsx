"use client";

import { Theme } from '@/types/theme';

interface ClientStyledWrapperProps {
  theme: Theme;
  children: React.ReactNode;
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
      <style jsx global>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --accent-color: ${theme.colors.accent};
          --background-color: ${theme.colors.background};
          --text-color: ${theme.colors.text};
        }
      `}</style>
      {children}
    </div>
  );
} 