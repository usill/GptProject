/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '0.4rem',
    },
    extend: {
      height: {
        "112": "28rem",
        "128": "36rem",
      },
    },
  },
  plugins: [],
}