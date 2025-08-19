import { useEffect, useMemo, useState } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { asyncRoutes, constantsRoutes } from '@/routers/routes'
import { filterAsyncRoutes } from '@/utils/generateTree'
import { useStores } from '@/hooks/useAppStore'
import { NotFound } from '@/views/NotFound.tsx'
import { type RouteObject, useLocation, useRoutes } from 'react-router-dom'

const RenderRoutes = ({ routes }: { routes: RouteObject[] }) => {
  return useRoutes([...routes])
}

export const AppRoutes = observer(() => {
  const [userRoutes, setRoutes] = useState<RouteObject[]>([...constantsRoutes])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { globalStore } = useStores()

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false)
      return
    }
    const dispose = reaction(
      () => ({
        rolesLen: globalStore.roles.length,
        menuLen: globalStore.menuList.length,
        path: location.pathname
      }),
      ({ rolesLen, menuLen, path }) => {
        if (path === '/login') {
          setLoading(false)
          return
        }
        if (rolesLen && menuLen) {
          setRoutes((prev) => [
            ...prev,
            ...filterAsyncRoutes(
              asyncRoutes,
              globalStore.menuList.map((v) => v.path!).filter(Boolean) as string[]
            ),
            { path: '*', element: <NotFound /> }
          ])
          setLoading(false)
        } else {
          void (async () => {
            // TODO 接口
            // const [err, result] = await getPermissionApi()
            // if (err) {
            //   setLoading(false)
            //   return
            // }
            // globalStore.setPermissions(result?.permissions ?? [])
            setLoading(false)
            globalStore.setMenuList([...asyncRoutes])
            globalStore.setRoles([{ id: '1', name: 'admin', isAdmin: true }])
            // globalStore.setRoles(result?.roles ?? [{ id: '1', name: 'admin', isAdmin: true }])
          })()
        }
      },
      { fireImmediately: true }
    )
    return () => dispose()
  }, [globalStore, location.pathname])

  const routes = useMemo(() => [...constantsRoutes, ...userRoutes], [userRoutes])
  return loading ? (
    <div className=" mt-90 lh-100% w-full h-full text-center fs-60px vertical-middle">
      loading...
    </div>
  ) : (
    <RenderRoutes routes={routes} />
  )
})
