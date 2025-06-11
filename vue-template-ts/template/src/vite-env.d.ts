/// <reference types="vite/client" />

declare module 'element-plus/dist/locale/en.mjs'
declare module 'element-plus/dist/locale/zh-cn.mjs'

declare module 'css-color-function' {
  export function convert(color: string): string
}
