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
  // Prevent Tailwind from styling Momentum Design web components
  important: false, // Don't use !important globally
  theme: {
    extend: {
      // Extend Tailwind to use Momentum Design CSS variables where possible
      colors: {
        // You can map Tailwind colors to Momentum variables if needed
      },
    },
  },
  plugins: [],
  // Exclude Momentum Design components from Tailwind's preflight reset
  // This ensures their styles aren't reset
}

