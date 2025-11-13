/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // Tailwind configuration - keep it simple like the starter repo
  // Momentum Design components use shadow DOM, so they're isolated from Tailwind
  theme: {
    extend: {},
  },
  plugins: [],
}

