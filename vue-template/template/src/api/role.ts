import service from '@/api/config/request.ts'
import { ApiResponse, IResponseList } from '@/api/config/type.ts'
import { IMenu } from '@/api/menu.ts'

export interface IRole {
  id?: number
  roleName: string
  roleCode: string
  description?: string
  createdTime?: string
  updatedTime?: string
  sort?: number
  status?: boolean
  delFlag?: boolean
  accessIds?: number[]
  accesses?: IMenu[]
}

export interface IRoleState {
  roles: IRole[]
  count: number
}

export interface IRoleParams {
  page: number
  size: number
}

// 获取角色列表
export const getRolesApi: (params?: IRoleParams) => Promise<IResponseList<IRole>> = (
  params = {
    page: 0,
    size: 10
  }
) => {
  return service.get('/role/list', {
    params
  })
}

// 新增角色
export const addRoleApi = (data: IRole): Promise<ApiResponse<IRole>> => {
  return service.post('/role/create', data)
}

// 根据 id 修改角色
export const updateRoleApi = (id: number, data: Partial<IRole>): Promise<ApiResponse<boolean>> => {
  return service.put(`/role/update/${id}`, data)
}

// 通过 id 删除一个角色
export const removeRoleApi = (id: number): Promise<ApiResponse<boolean>> => {
  return service.delete(`/role/delete/${id}`)
}

// 通过 id 获取一条角色信息
export const getOneRoleApi = (id: number): Promise<ApiResponse<IRole>> => {
  return service.get(`/role/info/${id}`)
}
// 关联角色和菜单
export const relationRoleAndAccessApi = (
  id: number,
  accessIds: number[]
): Promise<ApiResponse<boolean>> => {
  return service.put(`/role/${id}/access`, {
    accessIds
  })
}
