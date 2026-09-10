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
          bg: '#f0fdf4',
          card: '#ffffff',
          primary: '#15803d',
          'primary-dark': '#166534',
          'primary-light': '#dcfce7',
          accent: '#16a34a',
          'accent-light': '#d1fae5',
          harvest: '#d97706',
          'harvest-light': '#fef3c7',
          text: '#064e3b',
          secondary: '#334155',
          border: '#bbf7d0',
          success: '#16a34a',
          'success-light': '#dcfce7',
          warning: '#d97706',
          'warning-light': '#fef3c7',
          error: '#dc2626',
          'error-light': '#fee2e2',
          info: '#0284c7',
          'info-light': '#e0f2fe',
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
