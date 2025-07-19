/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 古典书页风格配色
        'book': {
          'bg': '#f5e8d5',
          'paper': '#f9f1e6',
          'primary': '#a34b2d',
          'secondary': '#5a3921',
          'accent': '#d4a574',
          'text': '#2d1810',
          'muted': '#8b6f47'
        },
        'vintage': {
          'gold': '#d4a574',
          'brown': '#8b6f47',
          'dark': '#2d1810'
        }
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'serif'],
        'book': ['Noto Serif SC', 'Georgia', 'serif']
      },
      boxShadow: {
        'book': '0 4px 12px rgba(139, 111, 71, 0.15)',
        'page': '0 2px 8px rgba(139, 111, 71, 0.1)',
        'inner-book': 'inset 0 1px 3px rgba(139, 111, 71, 0.1)'
      },
      backgroundImage: {
        'paper-texture': 'radial-gradient(circle at 1px 1px, rgba(139, 111, 71, 0.03) 1px, transparent 0)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
