import { RouteObject, useLocation, useRoutes } from 'react-router-dom'
import { asyncRoutes, constantsRoutes } from '@/routers/routes'
import { useEffect, useMemo, useState } from 'react'
import { getPermissionApi } from '@/api/user'
import { filterAsyncRoutes } from '@/utils/generateTree'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { setRoles, setMenuList, setPermissions } from '@/stores/system'
import { NotFound } from '@/views/NotFound.tsx'

export const AppRoutes = () => {
  const [userRoutes, setRoutes] = useState<RouteObject[]>([...constantsRoutes])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const roles = useAppSelector((state) => state.system.roles)
  const menuList = useAppSelector((state) => state.system.menuList)
  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false)
      return
    }

    const fetchUserRoles = async () => {
      // 模拟从服务器获取用户权限
      const [err, result] = await getPermissionApi()
      if (err) {
        setLoading(false)
        return
      }
      console.log(result)
      dispatch(setRoles(result!.roles))
      dispatch(setPermissions(result!.permissions))
      dispatch(setMenuList(result!.menus))
      setLoading(false)
    }

    if (roles?.length && menuList?.length) {
      setRoutes((prevRoutes) => [
        ...prevRoutes,
        ...filterAsyncRoutes(
          asyncRoutes,
          menuList.map((v) => v.url)
        ),
        {
          path: '*',
          element: <NotFound />
        }
      ])
      setLoading(false)
    } else {
      fetchUserRoles()
    }
  }, [dispatch, location.pathname, menuList, roles])
  const routes = useMemo(() => [...constantsRoutes, ...userRoutes], [userRoutes])
  return loading ? (
    <div w-full h-full text-center fs-60px vertical-middle className="len-100%" mt-90>
      loading...
    </div>
  ) : (
    <RenderRoutes routes={routes} />
  )
}

export const RenderRoutes = ({ routes }: { routes: RouteObject[] }) => {
  return useRoutes([...routes])
}
