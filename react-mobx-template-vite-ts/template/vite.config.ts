import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import UnocssVitePlugin from 'unocss/vite'
import postcssPlugin from 'postcss-preset-env'
import eslint from 'vite-plugin-eslint2'

const isProd = true
// const isProd = process.env.NODE_ENV === 'production'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      // 只在构建时检查，开发时不检查
      lintOnStart: isProd,
      // eslint 可执行文件
      eslintPath: 'eslint',
      // 开发模式显示错误覆盖
      emitError: isProd,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['node_modules', 'dist', 'public', '**/*.min.js', '**/*.css'],
      // 是否显示警告
      emitWarning: false,
      // 不检查缓存
      cache: false
    }),
    UnocssVitePlugin()
  ],
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
        target: 'http://104.194.73.115:8800',
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/dev-api/, 'api')
      },
      '^/api': {
        target: 'http://104.194.73.115:8800',
        // target: 'http://localhost:41000',
        changeOrigin: true
      }
    }
  }
})
