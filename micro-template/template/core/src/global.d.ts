import type { MoyiCustomEvent } from '@/customevent'

declare global {
  interface Window {
    __MOYI_CHILD_APP__: string
    __MOYI_ORIGIN_APP__: string
    __MOYI_MICRO_WEB__: boolean
    proxy: any
    custom: MoyiCustomEvent
  }
}



export {}
