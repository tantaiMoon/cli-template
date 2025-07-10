import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnocssVitePlugin from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import eslint from 'vite-plugin-eslint2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint(),
    UnocssVitePlugin(),
    // 手动导入 import ElementPlus from "unplugin-element-plus/vite"
    ElementPlus({}),
    // 自动导入
    AutoImport({
      // api
      resolvers: [ElementPlusResolver()]
      // 自动解析 vue vue-roter pinia 中的 api及生命周期方法等
      // imports: ['vue', 'pinia', 'vue-router'],
      //       // 给 eslint 生成的配置，只需要一次
      //       eslintrc: {
      //         enabled: false
      //       }
    }),
    Components({
      // 解析组件
      resolvers: [ElementPlusResolver()],
      // 自定义组件自动引入
      dirs: ['src/components', 'src/layouts', 'src/views/**/components']
    })
  ],

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  server: {
    port: 3666,
    proxy: {
      '/dev-api': {
        // target: 'http://localhost:41000',
        target: 'http://49.233.13.91:41000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/\/dev-api/, 'api')
      }
    }
  }
})
