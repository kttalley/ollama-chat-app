import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import fs from 'fs/promises'
import path from 'path'

// Custom plugin to rewrite dynamic imports for Momentum Design components
// This ensures icons, brand-visuals, and animations load correctly
function rewriteDynamicImportsEsbuild({packageName}) {
  let data

  switch (packageName) {
    case 'animations':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/animation\/animation\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/animations\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/animations'
      }
      break
    case 'brand-visuals':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/brandvisual\/brandvisual\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/brand-visuals\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/brand-visuals'
      }
      break
    case 'icons':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/icon\/icon\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/icons\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/icons'
      }
      break
    default:
      throw new Error('Invalid packageName for rewriteDynamicImportsEsbuild')
  }

  return {
    name: 'rewrite-dynamic-imports-esbuild',
    setup(build) {
      build.onLoad({ filter: data.componentFile }, async (args) => {
        const code = await fs.readFile(args.path, 'utf8')
        const replaced = code.replace(data.dynamicImport,
          (_match, importSubPath) => {
            const nodeModulesPath = path.join(process.cwd(), 'node_modules')
            const fullImportPath = path.join(nodeModulesPath, data.packageQualifier, importSubPath)
            const rel = path.relative(path.dirname(args.path), fullImportPath).replaceAll('\\', '/')
            return `import(\`${rel.startsWith('.') ? rel : './' + rel}\`)`
          }
        )
        return {
          contents: replaced,
          loader: 'js',
        }
      })
    }
  }
}

function rewriteDynamicImportsRollup({packageName}) {
  let data

  switch (packageName) {
    case 'animations':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/animation\/animation\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/animations\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/animations'
      }
      break
    case 'brand-visuals':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/brandvisual\/brandvisual\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/brand-visuals\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/brand-visuals'
      }
      break
    case 'icons':
      data = {
        componentFile: /node_modules\/@momentum-design\/components\/dist\/components\/icon\/icon\.component\.js$/,
        dynamicImport: /import\(\s*`@momentum-design\/icons\/([^`]+)`\s*\)/g,
        packageQualifier: '@momentum-design/icons'
      }
      break
    default:
      throw new Error('Invalid packageName for rewriteDynamicImportsRollup')
  }

  return {
    name: 'rewrite-dynamic-imports-rollup',
    enforce: 'pre',
    async transform(code, id) {
      if (!data.componentFile.test(id)) return null
      const replaced = code.replace(data.dynamicImport,
        (_match, importSubPath) => {
          const nodeModulesPath = path.join(process.cwd(), 'node_modules')
          const fullImportPath = path.join(nodeModulesPath, data.packageQualifier, importSubPath)
          const rel = path.relative(path.dirname(id), fullImportPath).replaceAll('\\', '/')
          return `import(\`${rel.startsWith('.') ? rel : './' + rel}\`)`
        }
      )
      return {
        code: replaced,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Keep Tailwind CSS v4 plugin
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        rewriteDynamicImportsEsbuild({packageName: 'brand-visuals'}), 
        rewriteDynamicImportsEsbuild({packageName: 'icons'}),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rewriteDynamicImportsRollup({packageName: 'brand-visuals'}), 
        rewriteDynamicImportsRollup({packageName: 'icons'}),
        rewriteDynamicImportsRollup({packageName: 'animations'}),
        dynamicImportVars({
          exclude: ['node_modules/@momentum-design/animations/**'],
          warnOnError: true,
        }),
      ],
    }
  },
  base: '/projects/chat/', // important for sub-folder deployment
  server: {
    host: true, // if you still run dev server remotely
    port: 3000,
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

