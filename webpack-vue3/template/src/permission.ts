import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { useGlobalStore } from '@/stores/global'
import { generateAsyncRoutes } from '@/utils/generateTree'

NProgress.configure({ showSpinner: false })
//  配置哪些页面不需要做校验
const whiteList = ['/login']
router.beforeEach(async (to) => {
  const globalStore = useGlobalStore()
  NProgress.start()
  const token = getToken()
  if (token) {
    // 获取用户信息
    if (to.path === '/login') {
      NProgress.done()
      return {
        path: '/',
        replace: true
      }
    }
    if (globalStore.roles?.length > 0) {
      NProgress.done()
      return true
    } else {
      const dynamicRoutes = await generateAsyncRoutes()
      dynamicRoutes.forEach((dynamicRoute) => {
        router.addRoute(dynamicRoute)
      })
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        meta: {
          hidden: true
        }
      })
      NProgress.done()
      return { ...to, replace: true }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      NProgress.done()
      return true
    }
    return {
      path: '/login',
      query: {
        redirect: to.path,
        ...to.query
      }
      // 跳转后的重定向参数
    }
  }
})
