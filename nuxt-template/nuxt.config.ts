// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  $production: {},
  $development: {},
  // 开发服务器
  devServer: {
    host: '0.0.0.0',
    port: 8000
  },
  // 组件配置
  components: [],
  vite: {
    optimizeDeps: {
      include: ['date-fns-tz/esm/formatInTimeZone']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '~/assets/styles/variables.scss' as *;`
        }
      }
    },
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  },
  // 初始化样式
  css: ['~/assets/styles/reset.css'],
  // 页面元数据
  app: {
    // 设置页面过渡
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    // layoutTransition: false, // 禁用布局组件过渡
    // pageTransition: false, // 禁用页面过渡
    // 头信息
    head: {
      title: 'Nuxt App',
      meta: [
        { hid: 'description', name: 'description', content: 'nuxt ssr app' },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'keyword nuxt ssr'
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0'
    }
  },
  // nuxtjs 模块，可再在此配置原子化 css/element-plus/naive-ui
  modules: [
    '@unocss/nuxt',
    /*'@element-plus/nuxt',*/ '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    'nuxtjs-naive-ui',
    '@nuxt/eslint'
  ],
  // elementPlus: {},
  // postcss 配置
  postcss: {
    plugins: {
      // 添加浏览器前缀
      autoprefixer: {}
    }
  },
  eslint: {
    //   检查代码
    checker: true,
    config: {
      autoInit: false // 启动时如果没有 eslint.config.* 文件不自动生成
    }
  },
  // 运行时配置
  runtimeConfig: {
    // 配置环境变量，默认只能在 服务端使用
    appSecret: 'secret',
    isServer: true,
    // 客户端可以使用，应在环境变量中设置
    // 通过 useRuntimeConfig 钩子函数获取,public 下的环境变量，在服务端和客户端都可以访问
    public: {
      baseUrl: '/',
      title: 'Nuxt Admin',
      description: 'nuxtjs ssr',
      theme: {
        dark: true
      }
    }
  },
  build: {}
})
