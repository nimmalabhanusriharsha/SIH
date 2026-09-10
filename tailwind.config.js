/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a18072',
          600: '#977669',
          700: '#846358',
          800: '#43302b',
          900: '#271915',
        },
        farmer: {
          bg: '#F7F2EA',
          card: '#FFFFFF',
          primary: '#C66A4A',
          'primary-dark': '#9E4F38',
          'primary-light': '#F7EBE7',
          accent: '#D9A441',
          'accent-light': '#FAF3E2',
          harvest: '#D9A441',
          'harvest-light': '#FAF3E2',
          text: '#263746',
          secondary: '#68747D',
          border: '#E8E2D8',
          success: '#4F8A78',
          'success-light': '#EDF5F2',
          warning: '#D49A32',
          'warning-light': '#FEF7E9',
          error: '#C85D55',
          'error-light': '#FDF0EE',
          info: '#527A9E',
          'info-light': '#EFF4F8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'farmer-card': '0 2px 14px -2px rgba(38, 55, 70, 0.06)',
        'farmer-elevated': '0 8px 30px -4px rgba(38, 55, 70, 0.12)',
      }
    },
  },
  plugins: [],
}
