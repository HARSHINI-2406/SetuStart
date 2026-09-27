/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#0f172a',
          900: '#0b1329',
          950: '#060b19',
        },
        gov: {
          blue: '#1e3a8a',
          light: '#3b82f6',
          accent: '#0284c7',
          emerald: '#059669',
          amber: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
