import path from 'path-browserify'
import { RouteObject } from 'react-router-dom'
import { Icon as IconifyIcon } from '@iconify/react'
import { constantsRoutes, asyncRoutes } from '@/routers/routes.tsx'

const getMenuIcon = (url: string) => {
  const routes: RouteObject[] = [...constantsRoutes, ...asyncRoutes]
  const computedicon = (list: RouteObject[]) => {
    let icon = ''
    list.forEach((item: RouteObject) => {
      if (item.path === url) {
        icon = item.meta!.icon! ?? ''
      }
      if (item.children?.length) {
        icon = computedicon(item.children)
      }
    })
    return icon
  }
  return computedicon(routes)
}

export const generateTree = (menuList: any[], withMeta = false) => {
  const map = menuList.reduce((memo, current) => {
    const temp: any = { children: [] }
    if (withMeta) {
      temp.meta = {
        ...current.meta,
        title: current.title || current.name,
        icon: current.icon
      }
      temp.key = current.url
      temp.label = current.title
      const icon = getMenuIcon(current.url)
      if (icon) temp.icon = <IconifyIcon icon={`ant-design:${icon}`}></IconifyIcon>
    }
    memo[current.id!] = temp
    return memo
  }, {} as any)
  const tree: any[] = [
    {
      key: '/home',
      label: '首页',
      icon: <IconifyIcon icon={`ant-design:home`}></IconifyIcon>,
      meta: {
        affix: true,
        title: '首页',
        hidden: false,
        alwaysShow: true
      }
    }
  ]
  for (const item of menuList) {
    const pid = item.parent?.id
    const cur = map[item.id!]
    if (pid) {
      const parent = map[pid]
      if (parent) {
        if (cur) {
          const children = parent?.children || []
          if (cur.children?.length < 1) {
            delete cur.children
          }
          children.push(cur)
          parent.children = children?.length >= 1 ? children : null
        }
        if (parent.children?.length < 1) {
          delete parent.children
        }
        // console.log(parent, cur)
        continue
      }
    }
    if (cur.children?.length < 1) {
      delete cur.children
    }
    tree.push(cur)
  }
  return tree
}

export const filterAsyncRoutes = (rawRoutes: RouteObject[], routesPath: string[]) => {
  const filterRoute = (rawRoutes: RouteObject[], routesPath: string[], basePath: string = '') => {
    const routes: RouteObject[] = []
    rawRoutes.forEach((route) => {
      const resolvePath = path.resolve(basePath, route.path!)
      if ((route.children?.length as number) > 0) {
        route.children = filterRoute(route.children!, routesPath, resolvePath)
      }
      if (routesPath.includes(resolvePath)) {
        routes.push(route)
      }
    })
    return routes
  }
  return filterRoute(rawRoutes, routesPath)
}
