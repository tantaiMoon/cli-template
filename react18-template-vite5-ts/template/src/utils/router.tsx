import { RouteObject } from 'react-router-dom'
import lazyload from '@/utils/lazyload.tsx'
import React from 'react'
import AuthProvider from '@/components/AuthProvider.tsx'

const allPages = import.meta.glob([
  '../views/**/*.tsx',
  '!../views/**/components/*.tsx',
  '!../views/Login/*.tsx',
  '!../views/404.tsx'
])

export type CustomRouteObject = {
  children?: CustomRouteObject[]
  name?: string
  meta?: Record<string, any>
} & RouteObject

export function getRoutePages() {
  const pageRoutes: CustomRouteObject[] = []
  for (const [pagePath] of Object.entries(allPages)) {
    const reg = /^\.\.\/views\/(?<name>.+)\/index\.tsx$/
    const matchs = pagePath.match(reg)
    // console.log(matchs)
    if (matchs) {
      const { name } = matchs.groups as any
      if (name) {
        // console.log(name.slice(name.indexOf('/') + 1))
        const resName = name.slice(name.lastIndexOf('/') + 1)
        // console.log(name.toLowerCase())
        const route: CustomRouteObject = {
          path: name.toLowerCase(),
          name: resName,
          element: <AuthProvider>{lazyload(React.lazy(() => import(pagePath)))}</AuthProvider>
        }
        if (resName.toLowerCase().includes('home')) {
          // @ts-ignore
          route.index = true
        }
        pageRoutes.push(route)
      }
    }
  }
  return pageRoutes
}
