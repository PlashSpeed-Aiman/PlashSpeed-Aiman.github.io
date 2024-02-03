/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        muted: "#7C9CBF",
        dark: "#2C2738",
        accent: "#0880AE",
      }
    },
  },
  plugins: [],
}