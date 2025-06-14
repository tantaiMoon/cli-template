declare interface ResponseData<T = any> {
  code: number
  data?: T
  msg: string
}

declare interface FormConfigItem {
  label?: string
  key: string
  name: string
  type:
    | 'input'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'checkgroup'
    | 'password'
    | 'radiogroup'
    | 'datepicker'
    | 'daterange'
  options?: SelectOptionConfig[]
  placeholder?: string
}

declare interface SelectOptionConfig {
  label: string
  value: any
}

declare interface MenuItemConfigProps {
  label: string
  name: string
  path: string
  meta?: {
    icon: string
    title: string
    key: string
  }
}

declare interface AuthStoreState {
  authRouter: string[]
  menuList: Partial<MenuItemConfigProps>[]
  authButtons: {
    [key: string]: string[]
  }
  collapsed: boolean
}

declare interface UserInfoProps {
  account: string
  id: string
  username: string
}

declare type UserStoreState = {
  token: string
  currentMenuKey: string
  userInfo: UserInfoProps | null
  roles: any[] | null
}

declare interface RootState {
  user: UserStoreState
  permission: AuthStoreState
}
