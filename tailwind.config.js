/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        bright: ['Bright', 'sans-serif']
      },
      colors: {
        mauve: {
          50: '#f8f6f7',
          100: '#f0ebed',
          200: '#e1d8dc',
          300: '#D4BEC9',
          400: '#b69dac',
          500: '#997d8f',
          600: '#7c6474',
          700: '#60505b',
          800: '#453b42',
          900: '#2b2529',
        },
      },
    },
  },
  plugins: [],
};