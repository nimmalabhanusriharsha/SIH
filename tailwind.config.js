const kisanColors = {
  bg: '#f8faf9',
  card: '#ffffff',
  primary: '#046a38',
  'primary-dark': '#03542c',
  'primary-light': '#e6f4ea',
  accent: '#16a34a',
  'accent-light': '#dcfce7',
  harvest: '#f59e0b',
  'harvest-light': '#fef3c7',
  text: '#0f172a',
  secondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  'success-light': '#d1fae5',
  warning: '#f59e0b',
  'warning-light': '#fef3c7',
  error: '#ef4444',
  'error-light': '#fee2e2',
  info: '#3b82f6',
  'info-light': '#dbeafe',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Unify all distinct palettes into the single KisanQueue theme
        farmer: kisanColors,
        forest: {
          50: '#f8faf9',
          100: '#e6f4ea',
          200: '#cce9d5',
          300: '#a3d6b3',
          400: '#7ac391',
          500: '#16a34a',
          600: '#046a38',
          700: '#03542c',
          800: '#023d20',
          900: '#012915',
          950: '#001a0d',
        },
        earth: {
          50: '#f8faf9',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'farmer-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'farmer-elevated': '0 8px 30px -4px rgba(0, 0, 0, 0.12)',
        'xs': '0 2px 4px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}
