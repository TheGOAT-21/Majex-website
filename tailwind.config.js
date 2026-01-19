/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        accent: '#3b82f6'
      }
    },
  },
  plugins: [],
}