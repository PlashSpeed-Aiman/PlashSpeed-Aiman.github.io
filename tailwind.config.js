/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Professional Palette
        brand: {
          stone: {
            950: '#0c0a09',
            900: '#1c1917',
            100: '#f5f5f4',
            50: '#fafaf9',
          },
          amber: {
            600: '#d97706',
            500: '#f59e0b',
            100: '#fef3c7',
          },
          orange: {
            800: '#9a3412',
          },
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '100': '25rem',   // 400px
        '128': '32rem',   // 512px
      },
      maxWidth: {
        '8xl': '1280px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      rotate: {
        '0.5': '0.5deg',
        '-0.5': '-0.5deg',
        '1': '1deg',
        '-1': '-1deg',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}