import { ApiResponse, IResponseList } from '@/api/config/type'
import service from '@/api/config/request'
import { IRole } from '@/api/role'

export interface UserLoginData {
  username: string
  password: string
  captcha?: string
  captchaKey?: string
}

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
  roles?: IRole[]
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

// login
export const loginApi = (data: UserLoginData): Promise<ApiResponse<LoginResponseData>> => {
  return service.post('/auth/login', data)
}

export const captchaApi = () => {
  return service.get('/auth/captcha', {
    responseType: 'blob'
  })
}

// 获取用户列表
export const getUsersApi: (params?: IUserQuery) => Promise<IResponseList<IProfile>> = (
  params = {
    page: 0,
    size: 10
  }
) => {
  return service.get('/user/list', {
    params
  })
}

// 新增角色
export const addUserApi = (data: IProfile): Promise<ApiResponse<IProfile>> => {
  return service.post('/user/create', data)
}

// 根据 id 修改角色
export const updateUserApi = (
  id: number,
  data: Partial<IProfile>
): Promise<ApiResponse<boolean>> => {
  return service.put(`/user/update/${id}`, data)
}

// 通过 id 删除一个角色
export const removeUserApi = (id: number): Promise<ApiResponse<boolean>> => {
  return service.delete(`/user/delete/${id}`)
}

// 通过 id 获取一条角色信息
export const getOneUserApi = (id: number): Promise<ApiResponse<IProfile>> => {
  return service.get(`/user/info/${id}`)
}

// 关联角色和菜单
export const relationRoleApi = (id: number, roleIds: number[]): Promise<ApiResponse<boolean>> => {
  return service.put(`/user/${id}/roles`, {
    roleIds
  })
}
