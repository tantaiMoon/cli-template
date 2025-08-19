/// <reference types="vite/client" />
import 'react-router-dom'

declare module 'react-router-dom' {
  interface IndexRouteObject {
    name?: string
    redirect?: string
    meta?: {
      auth?: boolean
      url?: string //
      icon?: string // 图标
      title?: string // 标题
      hidden?: boolean // 是否在菜单中隐藏
      alwaysShow?: boolean // 作为父级是否一直显示, true 为显示
      breadcrumb?: boolean // 是否在面包屑中显示
      keepAlive?: boolean // 是否缓存组件
      affix?: boolean // 是否固定在 tagsView 中
      cache?: boolean // 是否需要缓存组件
    }
  }

  interface NonIndexRouteObject {
    name?: string
    redirect?: string
    meta?: {
      auth?: boolean
      url?: string //
      icon?: string // 图标
      title?: string // 标题
      hidden?: boolean // 是否在菜单中隐藏
      alwaysShow?: boolean // 作为父级是否一直显示, true 为显示
      breadcrumb?: boolean // 是否在面包屑中显示
      keepAlive?: boolean // 是否缓存组件
      affix?: boolean // 是否固定在 tagsView 中
      cache?: boolean // 是否需要缓存组件
    }
  }
}
declare module 'css-color-function' {
  export function convert(color: string): string
}
