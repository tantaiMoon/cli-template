import { Get, Post } from '@/api/config'


export interface IUserState {
  users: UserInfoProps[]
  count: number
}

// 查询参数
export interface IUserQuery {
  page?: number
  size?: number
  mobile?: string
  status?: boolean
  username?: string
}

export interface LoginResponseData {
  token: {
    access_token: string
    refresh_token: string
  }
  user: UserInfoProps
}

export const getCaptchaApi = async () => {
  return Get<Blob>('/auth/captcha', {
    headers: { responseType: 'blob' }
  })
}

export const getPermissionApi = () => {
  return Get<{ menus: MenuItemProps[]; permissions: string[]; roles: RoleProps[] }>(`/auth/user/permissions`, {
    params: {
      platform: 2
    }
  })
}

export const loginApi = (data: LoginFieldType) => {
  return Post<{ token: { access_token: string; refresh_token: string }; user: UserInfoProps }>(
    `/auth/login`,
    data
  )
}
