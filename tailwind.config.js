/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#D4AF37", // Premium Champagne Gold
          hover: "#E8C85A",
          muted: "rgba(212, 175, 55, 0.15)",
        },
        navy: {
          950: "#060913", // Premium deep flight sky background
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
      }
    },
  },
  plugins: [],
}
