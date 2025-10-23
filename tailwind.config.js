/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'inclusive': ['Inclusive Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'browser-bg': '#f5f5f5',
        'browser-chrome': '#e5e5e5',
        'portfolio-green': '#348402',
      }
    },
  },
  plugins: [],
}
