import { createBrowserHistory } from 'history'
import { Navigate, Route, Routes, useNavigate, useRoutes, useSearchParams } from 'react-router-dom'
import { routes } from '@/router/routes.tsx'
import { useSelector } from 'react-redux'

export function Element(props: any) {
  const { element: Component } = props
  const navigate = useNavigate()
  const [usp] = useSearchParams()
  return (
    <Component
      navigate={navigate}
      usp={usp}
    />
  )
}

function createRoute(routes: any[]) {
  return (
    <>
      {routes.map((route) => {
        const { path, children, element } = route
        return (
          <Route
            key={path}
            path={path}
            element={element}
          >
            {Array.isArray(children) ? createRoute(children) : null}
          </Route>
        )
      })}
    </>
  )
}

export default function AppRoutes() {
  // const r = [...routes]
  // const permissionStore = useSelector((store: RootState) => store.permission)
  // const accessRoutes: any[] = [...permissionStore.authRouter]
  // accessRoutes.unshift({
  //   path: '/',
  //   element: <Navigate to="/home" />
  // })
  // r[0].children = accessRoutes
  // const RootRoute = createRoute([...r])
  // console.log(RootRoute)
  const elements = useRoutes([...routes])
  return elements
}

export function HookRoute() {
  function createRoute(routes: any[]) {
    const arr: any[] = [
      // {
      //   path: '/',
      //   element: <Navigate to="/home" />
      // }
    ]
    routes.forEach((route: any) => {
      if (route.children && route.children.length > 0) {
        if (route.isContainChild) {
          arr.push({
            path: route.path,
            name: route.name,
            element: route.element,
            children: [...createRoute(route.children)]
          })
        } else {
          arr.push({
            path: route.path,
            name: route.name,
            children: [...createRoute(route.children)]
          })
        }
      } else {
        arr.push({
          path: route.path,
          name: route.name,
          element: route.element
        })
      }
    })
    return arr
  }

  const r = [...routes]
  const permissionStore = useSelector((store: RootState) => store.permission)
  const accessRoutes: any[] = [...permissionStore.authRouter]
  r[0].children = createRoute([...accessRoutes])
  return useRoutes([...r])
}

export const history = createBrowserHistory()
