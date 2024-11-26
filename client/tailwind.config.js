/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3949AB',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8'
        },
        secondary: {
          light: '#90A4AE',
          DEFAULT: '#64748b',
          dark: '#475569'
        },
        background: {
          light: '#242424',
          DEFAULT: '#1E1E1E',
          dark: '#121212'
        }
      },
    },
  },
  plugins: [],
} 