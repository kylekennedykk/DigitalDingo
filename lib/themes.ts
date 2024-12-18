import { type Theme } from '@/types/portfolio'

export const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Modern Professional',
    colors: {
      primary: '#D17B30',
      secondary: '#1A1A1A',
      accent: '#F4A261',
      background: '#FFFFFF',
      text: '#1A1A1A'
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter'
    }
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Night',
    colors: {
      primary: '#FF00FF', // Bright magenta
      secondary: '#121212',
      accent: '#00FFFF', // Cyan
      background: '#0A0A0F',
      text: '#FFFFFF'
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'JetBrains Mono'
    }
  },
  forest: {
    id: 'forest',
    name: 'Nordic Forest',
    colors: {
      primary: '#2D5A27', // Deep forest green
      secondary: '#8B4513', // Saddle brown
      accent: '#F0E68C', // Khaki
      background: '#F8F6F0', // Off white
      text: '#2C3E50'
    },
    fonts: {
      heading: 'Bitter',
      body: 'Source Serif Pro'
    }
  },
  candy: {
    id: 'candy',
    name: 'Candy Pop',
    colors: {
      primary: '#FF69B4', // Hot pink
      secondary: '#9B59B6', // Purple
      accent: '#FFDF00', // Yellow
      background: '#FFF0F5', // Lavender blush
      text: '#4A235A'
    },
    fonts: {
      heading: 'Fredoka One',
      body: 'Quicksand'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#006994', // Deep blue
      secondary: '#00ACC1', // Cyan
      accent: '#48C9B0', // Turquoise
      background: '#F0FFFF', // Azure
      text: '#1A5276'
    },
    fonts: {
      heading: 'Sora',
      body: 'Work Sans'
    }
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage Paper',
    colors: {
      primary: '#8B0000', // Dark red
      secondary: '#4A4A4A', // Dark gray
      accent: '#DAA520', // Golden rod
      background: '#F4ECD8', // Antique white
      text: '#2F4F4F'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Crimson Pro'
    }
  },
  mint: {
    id: 'mint',
    name: 'Fresh Mint',
    colors: {
      primary: '#98FF98', // Mint green
      secondary: '#40826D', // Sea green
      accent: '#E0FFFF', // Light cyan
      background: '#F0FFF0', // Honeydew
      text: '#2E8B57'
    },
    fonts: {
      heading: 'DM Sans',
      body: 'Nunito'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Desert Sunset',
    colors: {
      primary: '#FF6B6B', // Coral
      secondary: '#4A90E2', // Sky blue
      accent: '#FFA07A', // Light salmon
      background: '#FFF5E6', // Light peach
      text: '#2C3E50'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans'
    }
  },
  monochrome: {
    id: 'monochrome',
    name: 'Minimal Mono',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      text: '#000000'
    },
    fonts: {
      heading: 'Archivo Black',
      body: 'IBM Plex Sans'
    }
  },
  aurora: {
    id: 'aurora',
    name: 'Northern Lights',
    colors: {
      primary: '#A463F2', // Purple
      secondary: '#45B7D1', // Turquoise
      accent: '#58D68D', // Green
      background: '#0A192F', // Dark blue
      text: '#E5E8E8'
    },
    fonts: {
      heading: 'Orbitron',
      body: 'Exo 2'
    }
  }
} 