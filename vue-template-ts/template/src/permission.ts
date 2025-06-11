import router, { asyncRoutes } from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { useGlobalStore } from '@/stores/global'
import { RouteRecordRaw } from 'vue-router'
import { IMenu } from '@/api/menu.ts'
import path from 'path-browserify'

NProgress.configure({ showSpinner: false })
//  配置哪些页面不需要做校验
const whiteList = ['/login']

function filterAsyncRoutes(menus: IMenu[]) {
  const routesPath = menus.map((menu) => menu.url) as string[]
  const filterRoute = (routes: RouteRecordRaw[], routesPath: string[], basePath = '/') => {
    const routesData: RouteRecordRaw[] = []
    routes.forEach((route) => {
      const resolvePath = path.resolve(basePath, route.path)
      if (route.children) {
        route.children = filterRoute(route.children, routesPath, resolvePath)
      }
      if (routesPath.includes(resolvePath) || (route.children && route.children?.length >= 1)) {
        routesData.push(route)
      }
    })

    return routesData
  }
  return filterRoute(asyncRoutes, routesPath)
}

const generateRoutes = async () => {
  const globalStore = useGlobalStore()
  if (!globalStore.roles?.length) {
    await globalStore.getPermissions()
  }
  let accessMenuRoute: RouteRecordRaw[] = []
  const menus = globalStore.menuList
  accessMenuRoute = filterAsyncRoutes(menus)
  return accessMenuRoute
}
router.beforeEach(async (to) => {
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
    } else {
      const globalStore = useGlobalStore()
      try {
        if (globalStore.menuList?.length > 0) {
          NProgress.done()
          return true
        }
        const routes = await generateRoutes()
        // 内部添加到映射表中
        routes.forEach((r) => {
          router.addRoute(r)
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
      } catch {
        await globalStore.logout()
        return {
          path: '/login',
          query: {
            redirect: to.path,
            ...to.query
          }
          // 跳转后的重定向参数
        }
      }
    }
    NProgress.done()
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
