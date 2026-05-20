/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c0d4ff',
          300: '#91b2ff',
          400: '#5c88ff',
          500: '#3461f5',
          600: '#1f44e8',
          700: '#1733c4',
          800: '#182ba0',
          900: '#192980',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f1117',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
