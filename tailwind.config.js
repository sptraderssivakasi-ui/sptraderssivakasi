/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#0F0A1E', 2: '#1A1233', 3: '#251B44', 4: '#130C28' },
        gold: { DEFAULT: '#E8A63D', soft: '#F4CE84', glow: 'rgba(232,166,61,0.25)' },
        maroon: { DEFAULT: '#8C1D2F', deep: '#6B1522' },
        paper: { DEFAULT: '#FBF3E2', dim: '#F3E8D3' },
        ink: { DEFAULT: '#2A2018', soft: '#6B5F50' },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
