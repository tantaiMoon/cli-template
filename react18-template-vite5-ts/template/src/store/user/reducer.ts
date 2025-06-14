import * as Types from '../mutation-types'
import { Action } from 'redux'
import { Draft, produce } from 'immer'
import { getToken, setToken } from '@/utils/auth.ts'
import { USER_INFO } from '@/constants.ts'

const userState: UserStoreState = {
  token: getToken() ?? '',
  currentMenuKey: window.location.pathname ?? '/home',
  userInfo: sessionStorage.getItem(USER_INFO)
    ? JSON.parse(sessionStorage.getItem(USER_INFO) ?? '{}')
    : null,
  roles: []
}

interface SET_TOKEN extends Action {
  type: typeof Types.SET_TOKEN
  token: string
}

interface SET_ROLES extends Action {
  type: typeof Types.SET_ROLES
  roles: string[]
}

interface SET_CURRENT_MENU extends Action {
  type: typeof Types.SET_CURRENT_MENU
  currentMenuKey: string
}

interface SET_USER_INFO extends Action {
  type: typeof Types.SET_USER_INFO
  userInfo: any
}

export type UserActionType = SET_TOKEN | SET_CURRENT_MENU | SET_USER_INFO | SET_ROLES

const user = (state: UserStoreState = userState, action: UserActionType) => {
  return produce(state, (draftState: Draft<UserStoreState>) => {
    switch (action.type) {
      case Types.SET_TOKEN:
        draftState.token = action.token
        setToken(draftState.token)
        return draftState
      case Types.SET_CURRENT_MENU:
        draftState.currentMenuKey = action.currentMenuKey
        return draftState
      case Types.SET_USER_INFO:
        draftState.userInfo = action.userInfo
        sessionStorage.setItem(USER_INFO, JSON.stringify(action.userInfo))
        return draftState
      case Types.SET_ROLES:
        draftState.roles = action.roles
        return draftState
      default:
        return state
    }
  })
}
export default user
