import path from 'path-browserify'
import { CustomRouteObject } from '@/utils/router.tsx'

export const generateMenuTree = (list: any[]) => {
  // 把所有的菜单放在 一个 map 里，key 是菜单 id ，值是菜单的浅克隆
  const map = list.reduce((acc, cur) => {
    const temp = { ...cur }
    acc[temp.id] = temp
    return acc
  }, {})
  const tree: MenuTreeNode[] = []
  list.forEach((item) => {
    const temp = map[item.id]
    const parentId = temp.parent_id // 获取父id
    if (parentId && map[parentId]) {
      // 如果有父节点
      const parent = map[parentId]
      parent.children = parent.children || []
      temp.path = path.posix.join(parent.path, temp.path)
      parent.children.push(temp)
    } else {
      // 没有父节点，说明是一级菜单
      tree.push(temp)
    }
  })
  return tree
}

export type MenuTreeNode = {
  id?: string | number
  parentId?: string | number
  parent_id?: string | number
  children?: MenuTreeNode[]
  title: string
  path: string
  icon?: string
}

const filterRoutes = (paths: string[], routes: CustomRouteObject[], basePath = '/') => {
  const routeData: any[] = []
  routes.forEach((route) => {
    // 根据父路径拼接一个完整的路由路径
    const routeFullPath = path.resolve(basePath, route.path!)
    if (route.children && route.children.length) {
      route.children = filterRoutes(paths, route.children, routeFullPath)
    }
    if (paths.includes(routeFullPath) || (route.children && route.children.length > 0)) {
      // 当前路由路径在有权限的菜单中,或者自己没权限，但是有子路由拥有权限
      routeData.push(route)
    }
  })
  return routeData
}
const generateMenuPath = (menus: MenuTreeNode[], paths: string[] = []) => {
  menus.forEach((item) => {
    paths.push(item.path)
    if (item.children) {
      generateMenuPath(item.children, paths)
    }
  })
  return paths
}
export const filterDynamicRoutes = (menus: MenuTreeNode[], routes: CustomRouteObject[]) => {
  const menuPaths = generateMenuPath(menus)
  // 根据菜单路径数组银蛇路由
  return filterRoutes(menuPaths, routes)
}
