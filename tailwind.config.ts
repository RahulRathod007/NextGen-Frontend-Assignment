import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0b1c18',
          soft: '#2a3f39',
          muted: '#5a6e67',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f3f7f5',
          elev: '#e8f0ec',
        },
        brand: {
          DEFAULT: '#0f766e',
          dark: '#0a5c56',
          light: '#14b8a6',
          mist: '#ccfbf1',
        },
        accent: {
          DEFAULT: '#d97706',
          soft: '#fef3c7',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(11,28,24,0.04), 0 8px 24px rgba(11,28,24,0.06)',
        glow: '0 0 0 4px rgba(15,118,110,0.12)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(at 0% 0%, rgba(20,184,166,0.18) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(217,119,6,0.12) 0px, transparent 45%), radial-gradient(at 100% 100%, rgba(15,118,110,0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(232,240,236,0.9) 0px, transparent 40%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
