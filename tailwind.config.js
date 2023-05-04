/** @type {import('tailwindcss/').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./models/**/*.{js,ts,jsx,tsx}",
    "./models/*.{js,ts,jsx,tsx}",
    "./app/*/components/*.{js,ts,jsx,tsx}",
    "./app/core/layouts/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
}
