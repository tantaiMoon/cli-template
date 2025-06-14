import { useLocation } from 'react-router-dom'
import routes from '@/router/routes.tsx'
import useStore from '@/hooks/useStore.ts'

const useAuthButtons = () => {
  const { pathname } = useLocation()
  const route = searchRoute(pathname, routes)
  const { permission } = useStore()
  const { authButtons } = permission
  return {
    BUTTONS: authButtons[route.meta!.key!] || {}
  }
}

const searchRoute = (key: string, routes: any[]) => {
  let res: any
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i]
    if (item.path === key) {
      return item
    } else if (item.children) {
      res = searchRoute(key, item.children)
    }
  }
  return res
}
export default useAuthButtons
