import { IMemuMap, IMenu } from '@/api/menu'
import { useGlobalStore } from '@/stores/global'
import { asyncRoutes } from '@/router/routes'
import { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'

export const generateTree = (list: IMenu[], withMeta = false) => {
  const map = list.reduce((memo, current) => {
    const temp: IMenu = { ...current, children: [] }
    if (withMeta) {
      temp.meta = {
        title: current.title || current.name,
        icon: current.icon
      }
    }
    memo[current.id!] = temp
    return memo
  }, {} as IMemuMap)
  const tree: IMenu[] = []
  for (const item of list) {
    const pid = item.parent?.id
    const cur = map[item.id!]
    if (pid) {
      const parent = map[pid]
      if (parent) {
        const children = parent?.children || []
        children.push(cur)
        parent.children = children
        continue
      }
    }
    tree.push(cur)
  }
  return tree
}

export const filterAsyncRoutes = (menus: IMenu[]) => {
  const routesPath = menus.map((menu) => menu.url) as string[]
  console.log(routesPath)
  const filterRoute = (routes: RouteRecordRaw[], routesPath: string[], basePath = '/') => {
    const routesData: RouteRecordRaw[] = []
    routes.forEach((route) => {
      const resolvePath = path.resolve(basePath, route.path)
      console.log(route, resolvePath)
      if (route.children) {
        route.children = filterRoute(route.children, routesPath)
      }
      if (routesPath.includes(resolvePath)) {
        routesData.push(route)
      }
    })

    return routesData
  }
  return filterRoute(asyncRoutes, routesPath)
}
export const generateAsyncRoutes = async () => {
  const globalStore = useGlobalStore()
  await globalStore.getPermissions()
  const dynamicRoutes = filterAsyncRoutes(globalStore.menuList)
  return dynamicRoutes
}
