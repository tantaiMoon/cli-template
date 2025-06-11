import service from '@/api/config/request'
import { ApiResponse, IResponseList } from '@/api/config/type'
import { IRole } from '@/api/role.ts'

export enum MenuType {
  feature = 'feature',
  module = 'module',
  menu = 'menu',
  button = 'button'
}

export interface IMenu {
  id?: number
  title?: string
  name?: string
  code?: string
  path?: string
  icon?: string
  url?: string
  type?: MenuType
  component?: string
  componentPath?: string
  parentId?: number
  parent?: IMenu
  children?: IMenu[]
  description?: string
  createdTime?: string
  updatedTime?: string
  sort?: number
  status?: boolean
  delFlag?: boolean
  meta?: {
    icon?: string
    title?: string
    hidden?: boolean
    affix?: boolean
    breadcurmb?: boolean
    alwaysShow?: boolean
  }
}

export interface IMenuParams {
  page: number
  size: number
}

export type IMemuMap = Record<number, IMenu>
export type Permission = {
  roles: IRole[]
  menus: IMenu[]
  permissions: string[]
}

// 获取权限菜单列表
export const getMenusApi: (params?: IMenuParams) => Promise<IResponseList<IMenu>> = (
  params = {
    page: 0,
    size: 10
  }
) => {
  return service.get('/menu/list', {
    params
  })
}
export const getMenuTreeApi: (params?: IMenuParams) => Promise<ApiResponse<IMenu[]>> = (params) => {
  return service.get('/menu/list/tree', {
    params
  })
}

// 新增权限菜单
export const addMenuApi = (data: IMenu): Promise<ApiResponse<IMenu>> => {
  return service.post('/menu/create', data)
}

// 根据 id 修改权限菜单
export const updateMenuApi = (id: number, data: Partial<IMenu>): Promise<ApiResponse<boolean>> => {
  return service.put(`/menu/update/${id}`, data)
}
// 批量修改权限菜单
export const updateBulkMenuApi = (access: Partial<IMenu>[]): Promise<ApiResponse<boolean>> => {
  return service.patch(`/menu/update`, { access })
}

// 通过 id 删除一个权限菜单
export const removeMenuApi = (id: number): Promise<ApiResponse<boolean>> => {
  return service.delete(`/menu/delete/${id}`)
}

// 通过 id 获取一条权限菜单信息
export const getOneMenuApi = (id: number): Promise<ApiResponse<IMenu>> => {
  return service.get(`/menu/info/${id}`)
}
