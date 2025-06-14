import * as Types from '../mutation-types'
import { Action } from 'redux'
import { Draft, produce } from 'immer'
import { MENU_INFO } from '@/constants.ts'
import { filterDynamicRoutes } from '@/utils/menuUtils.ts'
import { getRoutePages } from '@/utils/router.tsx'

const authState: AuthStoreState = {
  authRouter: sessionStorage.getItem(MENU_INFO)
    ? filterDynamicRoutes(JSON.parse(sessionStorage.getItem(MENU_INFO) ?? '[]'), getRoutePages())
    : [],
  authButtons: {},
  menuList: sessionStorage.getItem(MENU_INFO)
    ? JSON.parse(sessionStorage.getItem(MENU_INFO) ?? '[]')
    : [],
  collapsed: false
}

interface SET_AUTH_BUTTON extends Action {
  type: typeof Types.SET_AUTH_BUTTON
  authButtons: { [key: string]: string[] }
}

interface SET_COLLAPSED extends Action {
  type: typeof Types.SET_COLLAPSED
  collapsed: boolean
}

interface SET_AUTH_ROUTER extends Action {
  type: typeof Types.SET_AUTH_ROUTER
  authRouter: string[]
}

interface SET_MENU extends Action {
  type: typeof Types.SET_MENU
  menuList: any[]
}

export type AuthActionType = SET_AUTH_ROUTER | SET_AUTH_BUTTON | SET_MENU | SET_COLLAPSED

const permissionReducer = (state: AuthStoreState = authState, action: AuthActionType) => {
  return produce(state, (draftState: Draft<AuthStoreState>) => {
    switch (action.type) {
      case Types.SET_MENU:
        draftState.menuList = action.menuList
        return draftState
      case Types.SET_AUTH_ROUTER:
        draftState.authRouter = action.authRouter
        return draftState
      case Types.SET_AUTH_BUTTON:
        draftState.authButtons = action.authButtons
        return draftState
      case Types.SET_COLLAPSED:
        draftState.collapsed = action.collapsed
        return draftState
      default:
        return state
    }
  })
}
export default permissionReducer
