/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0B061A',
          2: '#140C2D',
          3: '#1D123F',
          4: '#291B56',
          card: '#150D2E',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FEF08A',
          soft: '#FBBF24',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        crimson: {
          DEFAULT: '#E11D48',
          light: '#FDA4AF',
          soft: '#FB7185',
          dark: '#9F1239',
          deep: '#4C0519',
        },
        maroon: {
          DEFAULT: '#881337',
          deep: '#4C0519',
        },
        emerald: {
          DEFAULT: '#10B981',
          dark: '#047857',
          soft: '#A7F3D0',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          dim: '#E2E8F0',
          muted: '#94A3B8',
        },
        ink: {
          DEFAULT: '#1E1B4B',
          soft: '#475569',
        },
      },
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.3)',
        'glow-gold-lg': '0 0 60px rgba(245, 158, 11, 0.45)',
        'glow-crimson': '0 0 30px rgba(225, 29, 72, 0.35)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.05)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFFBEB 0%, #FDE047 30%, #F59E0B 75%, #D97706 100%)',
        'festive-gradient': 'linear-gradient(135deg, #FF4365 0%, #E11D48 50%, #881337 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(29, 18, 63, 0.75) 0%, rgba(20, 12, 45, 0.85) 100%)',
      }
    },
  },
  plugins: [],
}
