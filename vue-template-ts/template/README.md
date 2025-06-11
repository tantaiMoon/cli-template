## 创建项目

```bash
pnpm create vite vue3-admin --template -vue-ts
```

更新 vue 版本为最新， 3.5.* 版本及以上

vue 3.5 以后， 可以使用解构的方式使用 props 属性，不会丢失响应式了

```ts
// 3.5 以前，这种方式会导致 name 失去响应式
// V3.5 及之后，可以使用解构的方式使用了(3.5.8 中， withDefaults 后失效)
const { name } = defineProps({})
```

## 编辑器配置文件

`.editorconfig`

```editorconfig
root = true

[*]
charset = utf-8
indent_size = 2
indent_style = space
end_of_line = lf
```

## 路径别名

`vite.config.ts`

```ts
import path from 'path'

export default defineConfig({
//   ...
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
})
```

`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  }
}

```

## 使用 eslint 检查代码

```bash
# 使用 npx 安装 eslint ，npx 是一个包执行器，包不存在时安装他
npx eslint --init
```

- 选择 检语法并发现问题
- 选择 esm 模块
- 选择 框架 vuejs
- 是否使用 ts
- 选择运行环境 browser 和 node
- 选择立即现在安装包
-

`eslint.config.js`

```js
import globals from 'globals'
import pluginJs from '@eslint/js' // 检验js的规范（推荐）
import tseslint from 'typescript-eslint' // 推荐的 ts规范
import pluginVue from 'eslint-plugin-vue' // 推荐的 vue 规范

export default [
  {
    // 校验的文件类型 mjs -》 esModule  cjs -》 commonjs
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    languageOptions: {
      // 全局变量
      globals: { ...globals.browser, ...globals.node }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'], // 校验vue中的ts代码
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    // 自定义规则
    rules: {
      'vue/multi-word-component-names': 0
    }
  },
  {
    // 哪些文件不通过 eslint 来进行校验
    ignores: ['.css', '*.d.ts']
  }
]

```

## 使用 prettier 格式化代码

```bash
pnpm add prettier eslint-plugin-prettier eslint-config-prettier -D
```

`prettier.config.js`

```js
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'none',
  arrowParens: 'always',
  jsxSingleQuote: false, // jsx不使用单引号,而使用双引号
  requirePragma: false, // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  proseWrap: 'preserve', // 使用默认的折行标准
  htmlWhitespaceSensitivity: 'css' // 根据显示样式决定html要不要折行
}
```

在 `eslint.config.js` 中新增 eslint-config-prettier 配置

```js
import prettierRecommended from "eslint-config-prettier"

export default [
  // ...
  prettierRecommended // 覆盖掉 eslint 的规范,代码格式化部分
]
```

## git 提交校验

```bash
pnpm add husky lint-staged

npx husky init
```

`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint",
    "lint:fix": "eslint --fix --quiet src",
    "format": "prettier --write src",
    "prepare": "husky"
  },
  "lint-staged": {
    "src/**/*.{js,ts,cjs,vue}": [
      "npm run lint:fix",
      "npm run format"
    ],
    "src/**/*.{html,json,css,scss}": [
      "npm run format"
    ]
  }
}
```

`.husky/pre-commit`

```text
npx lint-staged
```

## commitlint 校验提交信息

```bash
pnpm add @commitlint/{cli,config-conventional} -D
```

添加 `.husky/commit-msg`

```text
npx commitlint --edit $1
```

添加 `commitlint.config.cjs`

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
}
```

## 添加路由

```bash
pnpm add vue-router
```

`src/router/index.ts`

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/about",
    component: () => import("@/views/About.vue")
  }
]
const router = createRouter({
  history: createWebHistory(), // l路由模式
  routes // 路由表
})
export default router

```

`main.ts`

```ts
// ...
import router from '@/router'

// ...
app.use(router)
```

## 状态管理

```bash
pnpm add pinia
```

`src/stores/global.ts`

```ts
import { defineStore } from "pinia"
import { ref } from "vue"

export const useGlobalStore = defineStore("global", () => {
  const userString = localStorage.getItem("user")
  const userInfo = ref(userString ? JSON.parse(userString) : null)

  return {
    userInfo
  }
})
```

### 使用 pinia

`main.ts`

```ts
// ...
import { createPinia } from 'pinia'

const pinia = createPinia()
// ...
app.use(pinia)
```

`x.vue`

```ts
  import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
// globalStore.userInfo
// globalStore.setuserInfo(value)
```

## 引入 element-plus

```bash
pnpm add element-plus @element-plus/icon-vue
```

类型提示

`.tsconfig.app.json`

```json
{
  "compilerOptions": {
    "types": [
      "element-plus/global"
    ]
  }
}
```

`main.ts`

```ts
//...
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

// ...
app.use(ElementPlus)

```

## 配置 Element-plus 按需导入

element-plus[(https://element-plus.org/zh-CN/guide/quickstart.html)]

### 自动导入

```bash
pnpm add unplugin-vue-components unplugin-auto-import -D
```

`vite.config.ts`

```ts
//...
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

export default defineConfig({
  // ...
  plugins: [
    ///...
    AutoImport({
      // api
      resolvers: [ElementPlusResolver()],
      // 自动解析 vue vue-roter pinia 中的 api及生命周期方法等
      imports: ['vue', 'pinia', 'vue-router'],
      // 给 eslint 生成的配置，只需要一次
      eslintrc: {
        enabled: false
      },
    }),
    Components({
      // 解析组件
      resolvers: [ElementPlusResolver()],
      // 自定义组件自动引入
      dirs: ['src/components', 'src/layouts']
    })
  ],
})
```

`.eslntrc-auto-import.json`

```json
{
  "globals": {}
}

```

配置 tsconfig `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "types": [
      "element-plus/global",
      "./auto-imports.d.ts",
      "./components.d.ts"
    ]
  }
}
```

*配置 eslint 检查全局api*

`eslint.config.js`

```js
//...
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const eslintAutoImport = require("./.eslintrc-auto-import.json")

export default [
  //...
  {
    languageOptions: {
      // 全局变量
      globals: {
        //...
        ...eslintAutoImport.globals
      }
    }
  }
  //...
]

```

### 手动导入

```bash
pnpm add unplugin-element-plus -D
```

如果使用 unplugin-element-plus 并且只使用组件 API，你需要手动导入样式。

Example:

```ts
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
```

#### element-plus 服务组件

服务组件一般放到实例上

`src/plugins/element.ts`

```ts
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

export default (app: App) => {
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$prompt = ElMessageBox.prompt
}
```

`main.ts`

```ts
// ...
app.use(elementPlugin)
```

`vite.config.ts`

```ts
//...
import ElementPlus from "unplugin-element-plus/vite"

export default defineConfig({
  // ...
  plugins: [
    ///...
    ElementPlus() // 自动导入样式
  ],
})
```

**usage**

`databoard.vue`

```vue

<script lang="ts">
  const { proxy } = getCurrentInstance()!
  const handleClick = (e: MouseEvent) => {
    proxy?.$message("message")
  }
</script>
```

## 使用 原子化 css unocss

```bash
pnpm add unocss @unocss/preset-uno @unocss/preset-attributify -D
```

`uno.config.ts`

```ts
import presetAttributify from '@unocss/preset-attributify'
import presetUno from '@unocss/preset-uno'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetAttributify, presetUno]
})
```

unocss 支持属性式样式写法

```vue
<!--表示给元素添加一个 class text-red -->
<div text-red></div>
```

`vite.config.ts`

```ts
//...
import UnocssVitePlugin from "unocss/vite"

export default defineConfig({
  //...
  plugins: [vue(), UnocssVitePlugin()],
  //...
})
```

`main.ts`

```ts
//...
import "uno.css"
// ...
```

### unocss 支持组件 style 添加样式

```bash
pnpm add @unocss/transformer-directives -D 
```

`uno.config.ts`

```ts
// ...

import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...
  transformers: [transformerDirectives()]
})
```

组件内，使用 @apply 类名 的方式

```vue

<style scoped lang="scss">
  .app-wrap {
    //  添加 unocss 样式
    @apply p0 m0;
  }
</style>
```

## 布局组件

`src/layouts`

```vue

<script setup lang="ts"></script>

<template>
  <el-container class="app-wrap">
    <div class="sidebar-container">12</div>
    <el-container class="app-main">
      <el-header class="header">
        <el-breadcrumb>1</el-breadcrumb>
      </el-header>
      <el-main class="main-content">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
  .app-wrap {
    //  添加 unocss 样式
    @apply overflow-hidden p0 m0 h-full w-full;

    .sidebar-container {
      @apply w-[var(--sidebar-width)];
    }

    .header {
      height: calc(var(--navbar-height) + var(--tags-view-height));

      .navbar {
        @apply h-[var(--navbar-height)];
      }

      .tags-view {
        @apply h-[var(--tags-view-height)];
      }
    }

    .app-main {
      @apply p0;
    }

    .main-content {
      @apply overflow-x-hidden bg-gray;
      min-height: calc(100vh - var(--navbar-height) - var(--tags-view-height));
    }
  }
</style>
```

## 图标

图标在使用时，尽量使用 svg 而不是 font 字体图标，font 字体图标在缩放时会产生严重的锯齿

```bash
pnpm add @iconify/vue -D
pnpm add @unocss/preset-icons @iconify-json/ant-design -D
```

配置 unocss

`uno.config.ts`

```ts
export default defineConfig({
  presets: [presetIcons()],
  //...
  // 图标别名简拼
  shortcuts: [["icon", "inline-block w-1em h-1em align-middle text-current"]]
})
```

@iconify/vue 加载图标 动态加载图标并能够缓存组件

`src/components/SvgIcon/index.vue`

```vue

<script setup lang="ts">
  import { computed } from "vue"
  import { Icon as IconifyIcon } from "@iconify/vue"

  const { iconName, customClass } = defineProps<{
    iconName: string
    customClass: string
  }>()
  const isExt = computed(() => isExternal(iconName))
  const svgClass = computed(() => (customClass ? `icon ${ customClass }` : "icon"))
  const styleExternalIcon = computed(() => ({
    mask: `url(#${ iconName }) no-repeat 50% 50%`,
    '-webkit-mask': `url(#${ iconName }) no-repeat 50% 50%`,
    'mask-size': 'cover'
  }))
</script>

<template>
  <IconifyIcon :icon="iconName" :class="svgClass" v-if="!isExt"></IconifyIcon>
  <template v-else>
    <div :style="styleExternalIcon" :class="svgClass" bg-current v-bind="$attrs"></div>
  </template>
</template>

<style scoped lang="scss"></style>

```

## pinia 持久化存储

```bash
pnpm add pinia-plugin-persistedstate
```

`main.ts`

```ts
/// ...
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//...
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```

`stores/global.ts`

```ts
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
//...

export const useGlobalStore = defineStore(
  'global',
  () => {
    // ...
  },
  {
    persist: {
      // 配置持久化存储位置
      storage: window.localStorage,
      // 需要存储的状态,存储的路径必须导出，即 state 需要导出
      pick: [
        'state.sidebar',
        'state.system.userInfo',
        'state.system.token',
        'state.system.permissions',
        'state.system.menuTree'
      ]
    }
  }
)

```

## 添加路由表

给路由元信息添加扩展

`router/typings.d.ts`

```ts
import 'vue-router'

// ts 接口合并，给 meta 添加额外的属性
declare module 'vue-router' {
  interface RouteMeta {
    icon?: string
    title?: string
    hidden?: boolean
    alwaysShow?: boolean
    breadcrumb?: boolean
    keepAlive?: boolean
  }
}
```

新建路由，静态路由和动态路由区分

```ts
//...
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login,
    meta: {
      keepAlive: false,
      title: 'Login',
      icon: ''
    }
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          keepAlive: true,
          title: 'Dashboard',
          icon: 'ant-design:home'
        }
      }
    ]
  }
]
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layouts,
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '用户管理',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: () => import('@/views/System/Roles/index.vue'),
        meta: {
          title: '角色管理',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      },
      {
        path: '/system/access',
        name: 'Access',
        component: () => import('@/views/System/Accesses/index.vue'),
        meta: {
          title: '菜单权限',
          keepAlive: false,
          icon: 'ant-design:menu'
        }
      }
    ]
  },
  {
    path: '/content',
    component: Layouts,
    redirect: '/content/article',
    meta: {
      title: '内容管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/content/article',
        name: 'Article',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '文章管理',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/content/tags',
        name: 'Tags',
        component: () => import('@/views/System/Roles/index.vue'),
        meta: {
          title: '标签管理',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      },
      {
        path: '/content/category',
        name: 'Category',
        component: () => import('@/views/System/Accesses/index.vue'),
        meta: {
          title: '分类权限',
          keepAlive: false,
          icon: 'ant-design:menu'
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layouts,
    redirect: '/product/list',
    meta: {
      title: '商品管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/product/list',
        name: 'Product',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '商品列表',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/product/category',
        name: 'ProductCategory',
        component: () => import('@/views/System/Roles/index.vue'),
        meta: {
          title: '商品分类',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layouts,
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/order/list',
        name: 'Order',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '订单列表',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/order/refund',
        name: 'Refund',
        component: () => import('@/views/System/Roles/index.vue'),
        meta: {
          title: '退款',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      }
    ]
  }
  /*,{
   path: '/external-link',
   component: Layouts,
   children: [
   {
   path: 'https://baidu.com',
   meta: {
   icon: 'ant-design:link-outline'
   }
   }
   ]
   }*/
]
export const routes = [...constantRoutes, ...asyncRoutes]
```

## 菜单外链

`router/index.ts`

```ts
const routes = [
  // ...
  {
    path: '/external-link',
    component: Layouts,
    children: [
      {
        path: 'http://www.baidu.com',
        redirect: '/',
        meta: {
          icon: 'ant-design:link-outlined',
          title: 'link Baidu'
        }
      }
    ]
  }
]
```
