/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ksp: {
          navy: '#0f172a',
          dark: '#020617',
          gold: '#fbbf24',
          crimson: '#e11d48',
          blue: '#3b82f6'
        }
      }
    },
  },
  plugins: [],
}
