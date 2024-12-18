"use client";

import { Section } from '@/types/portfolio';
import dynamic from 'next/dynamic';

interface SectionPreviewProps {
  section: Section;
  theme: any; // Replace 'any' with your theme type
}

export default function SectionPreview({ section, theme }: SectionPreviewProps) {
  // Move any global styles to CSS modules or Tailwind
  // If you absolutely need global styles, they should go in ClientStyledWrapper
  return (
    <div className="preview-container">
      {/* Your preview content */}
    </div>
  );
} 