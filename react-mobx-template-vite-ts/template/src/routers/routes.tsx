import { AuthGuard } from '@/routers/auth-guard.tsx'
import type { RouteObject } from 'react-router-dom'
import { Home } from '@/views/Home'
import { Login } from '@/views/Login'
import { NotFound } from '@/views/NotFound'
import Layouts from '@/layouts'
import { lazy, Suspense } from 'react'

const MenuPage = lazy(() => import('@/views/Access/Menu'))
const RolePage = lazy(() => import('@/views/Access/Role'))
const UserPage = lazy(() => import('@/views/Access/User'))
const ArticlePage = lazy(() => import('@/views/Content/Article'))
const CategoryPage = lazy(() => import('@/views/Content/Category'))
const TagPage = lazy(() => import('@/views/Content/Tag'))
const SettingPage = lazy(() => import('@/views/System/Settings'))
const OrderPage = lazy(() => import('@/views/Orders/Order'))
const ProductPage = lazy(() => import('@/views/Products/Product'))

export const constantsRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layouts />,
    children: [
      {
        path: '/home',
        element: (
          <AuthGuard auth={true}>
            <Home />
          </AuthGuard>
        ),
        name: 'Home',
        meta: {
          icon: 'home',
          hidden: false,
          alwaysShow: true,
          title: 'Home'
        }
      }
    ]
  },
  {
    path: '/404',
    element: <NotFound />
  }
]
export const asyncRoutes: RouteObject[] = [
  {
    path: '/access',
    id: '/access',
    element: <Layouts />,
    meta: {
      title: '权限管理',
      icon: 'usergroup-add-outlined'
    },
    children: [
      {
        path: '/access/menu',
        id: '/access/menu',
        element: (
          <AuthGuard auth={true}>
            <Suspense fallback={<div>loading...</div>}>
              <MenuPage />
            </Suspense>
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '菜单管理',
          icon: ''
        }
      },
      {
        path: '/access/role',
        id: '/access/role',
        element: (
          <AuthGuard auth={true}>
            <RolePage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '角色管理',
          icon: ''
        }
      },
      {
        path: '/access/user',
        id: '/access/user',
        element: (
          <AuthGuard auth={true}>
            <UserPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '用户管理',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/content',
    id: '/content',
    element: <Layouts />,
    meta: {
      title: '内容管理',
      icon: 'file-text-filled'
    },
    children: [
      {
        path: '/content/article',
        id: '/content/article',
        element: (
          <AuthGuard auth={true}>
            <ArticlePage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '文章管理',
          icon: ''
        }
      },
      {
        path: '/content/category',
        id: '/content/category',
        element: (
          <AuthGuard auth={true}>
            <CategoryPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '分类管理',
          icon: ''
        }
      },
      {
        path: '/content/tag',
        id: '/content/tag',
        element: (
          <AuthGuard auth={true}>
            <TagPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '标签管理',
          icon: 'tags-filled'
        }
      }
    ]
  },
  {
    path: '/system',
    id: '/system',
    element: <Layouts />,
    meta: {
      title: '系统管理',
      icon: 'setting-outlined'
    },
    children: [
      {
        path: '/system/settings',
        id: '/system/settings',
        element: (
          <AuthGuard auth={true}>
            <SettingPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '设置',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/order',
    id: '/order',
    element: <Layouts />,
    meta: {
      title: '订单管理',
      icon: 'borderless-table-outlined'
    },
    children: [
      {
        path: '/order/list',
        id: '/order/list',
        element: (
          <AuthGuard auth={true}>
            <OrderPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '订单',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/product',
    id: '/product',
    element: <Layouts />,
    meta: {
      title: '商品管理',
      icon: 'product-filled',
      alwaysShow: false
    },
    children: [
      {
        path: '/product/list',
        id: '/product/list',
        element: (
          <AuthGuard auth={true}>
            <ProductPage />
          </AuthGuard>
        ),
        meta: {
          auth: true,
          title: '商品',
          icon: ''
        }
      }
    ]
  }
]
const routes: RouteObject[] = [...constantsRoutes]
export default routes
