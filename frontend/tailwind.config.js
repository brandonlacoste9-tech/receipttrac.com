/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ferrari-red': '#ff2800',
        'ferrari-red-dark': '#cc2000',
        'leather-black': '#0a0a0a',
        'leather-grey': '#151515',
        'off-white': '#e0e0e0',
      },
      fontFamily: {
        'sans': ['Outfit', 'Inter', 'sans-serif'],
        'serif': ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(255, 40, 0, 0.5)',
        'red-glow-lg': '0 0 30px rgba(255, 40, 0, 0.7)',
        'inset-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
