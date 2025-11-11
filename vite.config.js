import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/projects/chat/',             // important for sub-folder deployment
  build: {
    outDir: 'dist',                    // default; adjust if you move directory
    // other build options as needed
  },
  server: {
    host: true,                        // if you still run dev server remotely
    port: 3000,
    // remove allowedHosts if you’re only doing production build
    proxy: {
      '/api': {
        target: 'https://llm.kristiantalley.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})


