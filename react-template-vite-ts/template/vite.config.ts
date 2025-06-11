import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import UnocssVitePlugin from 'unocss/vite'
import postcssPlugin from 'postcss-preset-env'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), UnocssVitePlugin()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  },
  css: {
    postcss: {
      plugins: [postcssPlugin()]
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff' // 默认主题色
        },
        javascriptEnabled: true // 允许使用 JavaScript
      },
      scss: {}
    }
  },
  server: {
    port: 3100,
    strictPort: false,
    cors: true,
    proxy: {
      '^/dev-api': {
        target: 'http://49.233.13.91:41000',
        // target: 'http://localhost:41000',
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/dev-api/, 'api')
      }
    }
  }
})
