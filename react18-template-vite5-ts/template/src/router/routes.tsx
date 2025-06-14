import { Navigate } from 'react-router-dom'
import Login from '@/views/Login'
import NotFound from '@/views/404.tsx'
import { CustomRouteObject } from '@/utils/router.tsx'
import NotPermission from '@/views/403.tsx'
import AuthProvider from '@/components/AuthProvider.tsx'
import Layouts from '@/layouts'

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layouts />
      </AuthProvider>
    ),
    children: []
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
    meta: {}
  },
  {
    path: '/404',
    element: (
      <AuthProvider>
        <NotFound />
      </AuthProvider>
    ),
    meta: {}
  },
  {
    path: '*',
    element: <Navigate to={'/404'} />
  },
  {
    path: '/403',
    element: (
      <AuthProvider>
        <NotPermission />
      </AuthProvider>
    ),
    meta: {}
  }
]
