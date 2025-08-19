import path from 'path-browserify'
import type { RouteObject } from 'react-router-dom'
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

export const generateTree = (menuList: MenuItemProps[], withMeta = false) => {
  const map = menuList.reduce(
    (memo, current) => {
      const temp = { children: [] } as unknown as MenuItemProps
      if (withMeta) {
        temp.meta = {
          ...current.meta,
          title: current.meta?.title || current.meta?.name,
          icon: current.icon
        }
        temp.key = current.path as string
        temp.children = current?.children ?? []
        temp.label = current.meta?.title
        const icon = getMenuIcon(current.path as string)
        if (icon) temp.icon = <IconifyIcon icon={`ant-design:${icon}`}></IconifyIcon>
      }
      memo[current.id || current.path] = temp
      return memo
    },
    {} as { [key: string]: MenuItemProps }
  )
  const tree: MenuItemProps[] = [
    {
      id: 'home',
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
    const pid = item.parent?.id as string
    const cur = map[item.id || item.path]
    console.log('>>>----------generateTree.tsx--------->60 <==> cur:', cur)
    if (pid) {
      const parent = map[pid]
      if (parent) {
        if (cur) {
          if (!parent.children) {
            parent.children = []
          }
          if (cur.children?.length === 0) {
            delete cur.children
          }
          parent.children.push(cur)
        }
        if (parent?.children?.length === 0) {
          delete parent.children
        }
        // console.log(parent, cur)
        continue
      }
    }
    if (cur?.children?.length === 0) {
      delete cur.children
    }
    tree.push(cur)
    console.log('>>>----------generateTree.tsx--------->80 <==> tree:', tree)
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
