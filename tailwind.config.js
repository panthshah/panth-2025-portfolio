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
<<<<<<< HEAD
=======
        'samsung-sharp': ['Samsung Sharp Sans', 'system-ui', 'sans-serif'],
        'samsung-one': ['Samsung One', 'system-ui', 'sans-serif'],
>>>>>>> 01d84a03a669a89e90f41c23f41086b4b40f3d3a
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
