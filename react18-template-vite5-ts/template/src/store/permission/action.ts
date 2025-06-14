import * as Types from '../mutation-types'
import { getMenus } from '@/api'
import { Dispatch } from 'react'
import { filterDynamicRoutes, generateMenuTree } from '@/utils/menuUtils.ts'
import { getRoutePages } from '@/utils/router.tsx'
import { MENU_INFO } from '@/constants.ts'

export const setAuthButton = (authButtons: { [propName: string]: string[] }) => {
  return {
    type: Types.SET_AUTH_BUTTON,
    authButtons
  }
}

export const setAuthRouter = (authRouter: string[]) => {
  return {
    type: Types.SET_AUTH_ROUTER,
    authRouter
  }
}
export const setCollapsed = (collapsed: boolean) => {
  return {
    type: Types.SET_AUTH_ROUTER,
    collapsed
  }
}
export const setMenu = (menuList: any[]) => ({
  type: Types.SET_MENU,
  menuList
})

// 异步请求返回一个函数
export function getMenusByRole(roles: string[]) {
  // 希望他返回一个函数
  return (dispatch: Dispatch<any>) => {
    console.log('dispatch的时候该函数会自动执行')
    // 发送异步请求
    getMenus(roles).then((res: any) => {
      const menuList = generateMenuTree(res.data)
      dispatch(setMenu(menuList))
      sessionStorage.setItem(MENU_INFO, JSON.stringify(menuList))
      console.log(filterDynamicRoutes(menuList, getRoutePages()))
      dispatch(setAuthRouter(filterDynamicRoutes(menuList, getRoutePages())))
    })
  }
}
