/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070a',
          900: '#0b0d12',
          800: '#12151c',
          700: '#1b1f29',
          600: '#262b38',
        },
        brand: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#c9bfff',
          300: '#a894ff',
          400: '#8b6bff',
          500: '#7c4dff',
          600: '#6c2fff',
          700: '#5a1fe0',
          800: '#4a19b8',
          900: '#3d1794',
        },
        accent: {
          400: '#3fe0c5',
          500: '#22d3aa',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,77,255,0.15), 0 8px 30px -8px rgba(124,77,255,0.45)',
        card: '0 4px 24px -6px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% 20%, rgba(124,77,255,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(34,211,170,0.14), transparent 40%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
