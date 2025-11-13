/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // Important: Prevent Tailwind from overriding Momentum Design CSS variables
  corePlugins: {
    preflight: true, // Keep preflight but ensure Momentum variables take precedence
  },
  theme: {
    extend: {
      // Extend Tailwind to use Momentum Design CSS variables where possible
      colors: {
        // You can map Tailwind colors to Momentum variables if needed
      },
    },
  },
  plugins: [],
}

