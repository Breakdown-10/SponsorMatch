/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e8ecf6',
          200: '#cbd5ec',
          300: '#9fb3de',
          400: '#6c8dcc',
          500: '#476aba',
          600: '#35519f',
          700: '#2c4180',
          800: '#273869',
          900: '#233157',
          950: '#171f37',
        },
      },
    },
  },
  plugins: [],
}
