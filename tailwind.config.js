/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0A0A0A',
          DEFAULT: '#0F0F0F',
          light: '#171717',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
        },
        secondary: {
          DEFAULT: '#6D28D9',
          hover: '#5B21B6',
        },
        accent: {
          DEFAULT: '#C4B5FD',
          hover: '#A78BFA',
        },
        neutral: {
          50: '#F8F8F8',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#616161',
          600: '#424242',
          700: '#303030',
          800: '#212121',
          900: '#121212',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};