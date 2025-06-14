import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'node:path'
import UnocssVitePlugin from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnocssVitePlugin()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  },
  server: {
    strictPort: false,
    cors: true,
    proxy: {
      '^/dev-api': {
        target: 'http://49.233.13.91:41000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, 'api')
      }
    }
  }
})
