/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bronze: {
          DEFAULT: '#B08D57',
          light: '#C8A66B',
          dark: '#8C6E41',
        },
        gold: '#C8A66B',
        charcoal: '#1A1A1A',
        ink: '#0E0E0E',
        night: '#111111',
        muted: '#B8B8B8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 3.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 0 45px rgba(176, 141, 87, 0.28)',
        'glow-soft': '0 0 80px rgba(176, 141, 87, 0.15)',
      },
      backgroundImage: {
        'bronze-gradient': 'linear-gradient(135deg, #B08D57 0%, #C8A66B 50%, #B08D57 100%)',
        'bronze-radial': 'radial-gradient(circle at 30% 20%, rgba(176,141,87,0.22), transparent 60%)',
        'dark-fade': 'linear-gradient(to bottom, rgba(14,14,14,0) 0%, rgba(14,14,14,0.85) 75%, #0E0E0E 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        marquee: 'marquee 35s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2, 0.6, 0.4, 1) infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        cursor: '9999',
        loader: '10000',
      },
    },
  },
  plugins: [],
}
