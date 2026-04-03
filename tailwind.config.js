/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1A2E4A', 50: '#E8EEF5', 100: '#C5D2E3', 700: '#142338', 800: '#0E1826' },
        orange: { tcl: '#E8700A', light: '#FEF3E8' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', modal: '0 20px 60px rgba(0,0,0,0.15)' },
    },
  },
  plugins: [],
}
