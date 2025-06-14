import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string
    affix?: boolean
    hidden?: boolean
    alwaysShow?: boolean
    breadcrumb?: boolean
    cache?: boolean
  }
}
