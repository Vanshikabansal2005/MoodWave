/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          300: '#FF9A5C',
          500: '#FF6B35',
        },
        rose: {
          100: '#FFE4E6',
          400: '#FB7185',
          600: '#E11D6A',
        },
        darkBase: '#1A0A0F',
        offWhite: '#FFF7F5',
        glassTint: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
