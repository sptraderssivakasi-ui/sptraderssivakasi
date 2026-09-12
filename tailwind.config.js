/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#111111', 2: '#1b1b1b', 3: '#252525', 4: '#0a0a0a' },
        gold: { DEFAULT: '#111111', soft: '#444444', glow: 'rgba(0,0,0,0.18)' },
        maroon: { DEFAULT: '#333333', deep: '#1f1f1f' },
        paper: { DEFAULT: '#f7f7f7', dim: '#d4d4d4' },
        ink: { DEFAULT: '#2A2018', soft: '#6B5F50' },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Manrope', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
