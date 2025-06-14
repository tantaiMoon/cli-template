import React from 'react'
import SuspenseLazy from '@/components/SuspenseLazy'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import Layouts from '@/layouts'

const Home = SuspenseLazy(() => import(/* webpackChunkName:"home" */ '@/views/Home'))
const User = SuspenseLazy(() => import(/* webpackChunkName:"home-one" */ '@/views/System/User'))
const Role = SuspenseLazy(() => import(/* webpackChunkName:"home-two" */ '@/views/System/Role'))
const Access = SuspenseLazy(
  () => import(/* webpackChunkName:"home-three" */ '@/views/System/Access')
)
// const Profile = SuspenseLazy(() => import(/* webpackChunkName:"home-four" */ '@/views/Profile'));
const Login = SuspenseLazy(() => import(/* webpackChunkName:"home-mobx" */ '@/views/Login'))
const NotFound = SuspenseLazy(() => import(/* webpackChunkName:"not-found" */ '@/views/NotFound'))

export type IRouteObject = RouteObject & {
  meta?: {
    con?: string // 图标
    title?: string // 标题
    hidden?: boolean // 是否在菜单中隐藏
    alwaysShow?: boolean // 作为父级是否一直显示, true 为显示
    breadcrumb?: boolean // 是否在面包屑中显示
    affix?: boolean // 是否固定在 tagsView 中
    cache?: boolean // 是否需要缓存组件
  }
  children?: IRouteObject[]
}

export const staticRoutes: IRouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" /> // 重定向
  },
  {
    path: '/home',
    element: <Layouts />,
    children: [
      // 嵌套路由
      {
        index: true,
        element: Home,
        meta: {
          affix: true,
          title: '首页'
        }
      }
    ]
  },
  {
    path: 'login',
    element: Login,
    meta: {
      hidden: true,
      title: '登录'
    }
  },
  // 未匹配到页面
  {
    path: '*',
    element: NotFound,
    meta: {
      hidden: true,
      title: '404'
    }
  }
]
export const asyncRoutes: IRouteObject[] = [
  {
    path: 'system',
    element: <Layouts></Layouts>,
    meta: {},
    children: [
      {
        path: 'user',
        element: User,
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'role',
        element: Role,
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'menu',
        element: Access,
        meta: {
          title: '权限管理'
        }
      }
    ]
  }
]
const routes: IRouteObject[] = [...staticRoutes, ...asyncRoutes]

export default routes
export const AppRoutes = () => {
  console.log(1234)
  const elements = useRoutes(routes)
  return elements
  // console.log(elements)
}
