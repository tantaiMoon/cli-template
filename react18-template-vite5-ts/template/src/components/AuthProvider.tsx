import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/auth.ts'

const WHITE_LIST = ['/login', '/register', '/policy']

const AuthProvider = (props: { children: ReactNode }) => {
  const { pathname, state, key, search } = useLocation()
  const token = getToken()
  console.log(pathname, state, key, search, 'name')
  document.title = pathname.split('/').reverse()[0]
  if (!token) {
    if (!WHITE_LIST.includes(pathname)) {
      return (
        <Navigate
          to="/login"
          replace
        />
      )
    }
    return props.children
  }
  if (pathname === '/login') {
    return (
      <Navigate
        to="/home"
        replace
      />
    )
  }

  return props.children
}
export default AuthProvider
