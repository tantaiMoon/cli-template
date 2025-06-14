import * as Types from '../mutation-types'
import { Dispatch } from 'react'
import { login } from '@/api'

export const setToken = (token: string) => ({
  type: Types.SET_TOKEN,
  token
})
export const setMenuKey = (currentMenuKey: string) => ({
  type: Types.SET_CURRENT_MENU,
  currentMenuKey
})

export const setUserInfo = (userInfo: any) => ({
  type: Types.SET_USER_INFO,
  userInfo
})

export const setCurrentMenu = (currentMenuKey: string) => {
  return {
    type: Types.SET_CURRENT_MENU,
    currentMenuKey
  }
}

export function dispatchLogin(values: any) {
  return (dispatch: Dispatch<any>) => {
    login(values).then((res: any) => {
      dispatch(setUserInfo(res))
      dispatch(setToken('token'))
    })
  }
}
