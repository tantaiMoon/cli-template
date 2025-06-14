import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layouts from '@/layouts/index.vue'
import Login from '@/views/Login.vue'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    meta: {
      keepAlive: false,
      title: 'Login',
      icon: '',
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      keepAlive: false,
      title: 'Redirect',
      icon: '',
      hidden: true,
      breadcrumb: false
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect.vue'),
        meta: {
          hidden: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'ant-design:home',
          cache: true,
          affix: true // 固定在 tagsView 中
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: {
      keepAlive: false,
      title: 'NotFound',
      icon: '',
      hidden: true,
      breadcrumb: false
    }
  }
]
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/access',
    component: Layouts,
    redirect: '/access/user',
    meta: {
      title: '权限管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: true
    },
    children: [
      {
        path: '/access/user',
        name: 'User',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          title: '用户管理',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/access/role',
        name: 'Role',
        component: () => import('@/views/System/Roles/index.vue'),
        meta: {
          title: '角色管理',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      },
      {
        path: '/access/menu',
        name: 'Access',
        component: () => import('@/views/System/Accesses/index.vue'),
        meta: {
          title: '菜单管理',
          keepAlive: false,
          icon: 'ant-design:menu'
        }
      }
    ]
  },
  {
    path: '/content',
    component: Layouts,
    redirect: '/content/article',
    meta: {
      title: '内容管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/content/article',
        name: 'Article',
        component: () => import('@/views/Content/Article/index.vue'),
        meta: {
          title: '文章管理',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/content/tag',
        name: 'Tags',
        component: () => import('@/views/Content/Tags/index.vue'),
        meta: {
          title: '标签管理',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      },
      {
        path: '/content/category',
        name: 'Category',
        component: () => import('@/views/Content/Category/index.vue'),
        meta: {
          title: '分类管理',
          keepAlive: false,
          icon: 'ant-design:menu'
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layouts,
    redirect: '/product/list',
    meta: {
      title: '商品管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: 'list',
        name: 'Product',
        component: () => import('@/views/Product/ProductList/index.vue'),
        meta: {
          title: '商品列表',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/product/category',
        name: 'ProductCategory',
        component: () => import('@/views/Product/ProductCategory/index.vue'),
        meta: {
          title: '商品分类',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layouts,
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/order/list',
        name: 'Order',
        component: () => import('@/views/Order/OrderList/index.vue'),
        meta: {
          title: '订单列表',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      },
      {
        path: '/order/refund',
        name: 'Refund',
        component: () => import('@/views/Order/RefundList/index.vue'),
        meta: {
          title: '退款单',
          keepAlive: false,
          icon: 'ant-design:usergroup-delete-outlined'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layouts,
    redirect: '/system/settings',
    meta: {
      title: '系统设置',
      icon: 'ant-design:setting-twotone',
      alwaysShow: true,
      keepAlive: false,
      breadcrumb: false
    },
    children: [
      {
        path: '/system/settings',
        name: 'Setting',
        component: () => import('@/views/Order/OrderList/index.vue'),
        meta: {
          title: '网站设置',
          keepAlive: false,
          icon: 'ant-design:user'
        }
      }
    ]
  }
]
// 合并路由
export const routes = [...constantRoutes]
const router = createRouter({
  history: createWebHistory(), // l路由模式
  routes // 路由表
})
export default router
