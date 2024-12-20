export const theme = {
  colors: {
    primary: {
      ochre: '#D17B30',
      red: '#9B2C2C',
      earth: '#8B4513',
      yellow: '#F2B705',
      sand: '#F5DEB3'
    },
    neutral: {
      black: '#1A1A1A',
      white: '#FFFFFF',
      gray: {
        100: '#F7F7F7',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717'
      }
    },
    accent: {
      teal: '#2D8B8B',
      purple: '#684D7F',
      green: '#4A6741'
    }
  },
  fonts: {
    heading: '"Clash Display", sans-serif',
    body: '"Inter", sans-serif'
  },
  spacing: {
    container: {
      padding: '2rem',
      maxWidth: '1440px'
    }
  }
}

export type Theme = typeof theme 