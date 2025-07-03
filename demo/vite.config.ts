import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  const alias = isProduction
    ? undefined
    : {
        // For local development, alias the package to the parent src directory
        '@kaizen-tech-collective/react-spreadsheet-validator': path.resolve(__dirname, '../src/index.tsx')
      }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    resolve: alias ? { alias } : {}
  }
})
