
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Paleta principal de Netflix
        netflix: {
          red: '#E50914',
          black: '#141414',
          gray: {
            dark: '#181818',
            medium: '#2F2F2F',
            light: '#808080'
          }
        }
      },
      fontFamily: {
        sans: ['"Netflix Sans"', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '2xs': '0.625rem'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      minHeight: {
        'screen-without-nav': 'calc(100vh - 5rem)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        'body': {
          backgroundColor: theme('colors.netflix.black'),
          color: 'white'
        }
      })
    }
  ]
}
