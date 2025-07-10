import { turnApp } from './routerHandle'
import { patchRouter } from '@/utils'


// 重写路由
export const rewriteRouter = (path: string) => {
  window.history.pushState = patchRouter(window.history.pushState, 'micro_push')
  window.history.replaceState = patchRouter(window.history.replaceState, 'micro_replace')

  window.addEventListener('micro_push' as any,  turnApp)
  window.addEventListener('micro_replace' as any, turnApp)

  // 重写popstate， 浏览器后退事件监听
  window.onpopstate = function() {
    turnApp(arguments)
  }
}
