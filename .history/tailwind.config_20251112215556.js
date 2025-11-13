/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // Tailwind configuration - keep it simple like the starter repo
  // Momentum Design components use shadow DOM, so they're isolated from Tailwind
  theme: {
    extend: {
      // You can use Momentum Design CSS variables in Tailwind like this:
      // border-[var(--mds-color-theme-control-active-normal)]
      // bg-[var(--mds-color-theme-background-solid-primary-normal)]
      // text-[var(--mds-color-theme-text-primary-normal)]
      // 
      // Note: Always use var() syntax in Tailwind arbitrary values
      colors: {
        // Optional: Map Momentum variables to Tailwind colors if needed
        // 'mds-control': 'var(--mds-color-theme-control-active-normal)',
      },
    },
  },
  plugins: [],
}

