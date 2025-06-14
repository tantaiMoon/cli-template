import { getToken } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  // 客户端
  if (import.meta.client) {
    // 不需要登录就可以访问的页面
    const whiteList: string[] = ['/register', '/404', '/403', '/my-error']
    const token = getToken()
    if (!token) {
      // 如有 token ，路由为 login 时直接进入，
      if (to.path === '/login') {
        return true
      } else {
        if (whiteList.includes(to.path)) {
          return true
        }
        // 如果不在白名单并且不是 login ，则重定向到 login
        return navigateTo({
          path: '/login',
          replace: true,
          query: {
            redirect: to.fullPath,
            message: '未登录，请重新登录',
            code: 401
          }
        })
      }
    } else {
      // 如果有 token 并且路由是 login ，则重定向到 home
      if (to.path === '/login' || to.path === '/') {
        return navigateTo('/home', {
          replace: true
        })
      }
      return true
    }
  }
})
