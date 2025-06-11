import { Get, Post } from '@/api/config'

export interface IProfile {
  id?: number
  name?: string
  username?: string
  mobile?: string
  gender?: number
  avatar?: string
  email?: string
  status?: boolean
  description?: string
  roles?: any[]
  roleIds?: number[]
}

export interface IUserState {
  users: IProfile[]
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
  user: IProfile
}

export const getCaptchaApi = async () => {
  return Get<Blob>('/auth/captcha', {
    headers: { responseType: 'blob' }
  })
}

export const getPermissionApi = () => {
  return Get<{ menus: any[]; permissions: string[]; roles: any[] }>(`/auth/user/permissions`, {
    params: {
      platform: 2
    }
  })
}

export const loginApi = (data: { username: string; password: string; captcha: string }) => {
  return Post<{ token: { access_token: string; refresh_token: string }; user: any }>(
    `/auth/login`,
    data
  )
}
