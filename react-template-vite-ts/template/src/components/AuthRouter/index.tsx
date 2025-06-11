import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { getToken } from '@/utils/auth.ts'
import routes from '@/routers/routes'
import { useEffect } from 'react'
import { message } from 'antd'
import { useAppSelector } from '@/hooks/useAppStore.ts'

export default function AuthRouter({ children, auth }: any) {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getToken()
  const matchs = matchRoutes(routes, location)
  const userInfo = useAppSelector((state) => state.system.userInfo)
  const isExist = matchs?.some((item) => item.pathname === location.pathname)
  useEffect(() => {
    if (!token && auth) {
      message.error('token 已过期，请重新登录')
      navigate('/login')
    }
    if (token && isExist && userInfo) {
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/home')
      } else {
        navigate(location.pathname)
      }
    }
  }, [token, location.pathname])
  return children
}
