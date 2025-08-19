import { getToken } from '@/utils/auth.ts'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const AuthGuard = ({ children, auth = true }: { children: React.ReactNode; auth: boolean }) => {
  const token = getToken()
  const location = useLocation()
  console.log(location.pathname)
  if (!token && auth) return <Navigate to={'/login'} replace />
  if (location.pathname === '/' || location.pathname === '/login') {
    return <Navigate to={'/home'} />
  }
  return children
}
