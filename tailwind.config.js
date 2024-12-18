module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-ochre': '#CD853F',
        'earth': {
          50: '#FAF5F0',
          100: '#F5EBE0',
          200: '#E6D5C1',
          300: '#D4BA98',
          400: '#C19B6E',
          500: '#B38B5D',
          600: '#8C6D4A',
          700: '#735A3E',
          800: '#5C482F',
          900: '#443524',
        },
        'ochre': {
          50: '#FFF8E5',
          100: '#FFE9B3',
          200: '#FFD97F',
          300: '#FFC94D',
          400: '#FFB91A',
          500: '#E6A100',
          600: '#B37E00',
          700: '#805A00',
          800: '#4D3600',
          900: '#1A1200',
        },
      },
    },
  },
  plugins: [],
}