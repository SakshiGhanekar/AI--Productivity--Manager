/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgba(var(--primary), <alpha-value>)',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: 'rgba(var(--primary), <alpha-value>)',
          500: 'rgba(var(--primary), <alpha-value>)',
          600: 'rgba(var(--primary), <alpha-value>)',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        secondary: {
          DEFAULT: 'rgba(var(--secondary), <alpha-value>)',
          400: 'rgba(var(--secondary), <alpha-value>)',
          500: 'rgba(var(--secondary), <alpha-value>)',
          600: 'rgba(var(--secondary), <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgba(var(--accent), <alpha-value>)',
          400: 'rgba(var(--accent), <alpha-value>)',
          500: 'rgba(var(--accent), <alpha-value>)',
          600: 'rgba(var(--accent), <alpha-value>)',
        },
        success: '#00E676',
        warning: '#FFB020',
        danger: '#FF5252',
        brandBg: 'rgba(var(--brand-bg), <alpha-value>)',
        brandSidebar: 'rgba(var(--brand-sidebar), <alpha-value>)',
        brandCard: 'rgba(var(--brand-card), <alpha-value>)',
        brandText: 'rgba(var(--brand-text), <alpha-value>)',
        brandMuted: 'rgba(var(--brand-muted), <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px 0px rgba(0, 212, 170, 0.4)' },
          '50%': { opacity: .8, boxShadow: '0 0 25px 5px rgba(0, 212, 170, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
