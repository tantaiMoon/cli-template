import { ApiResponse } from '@/api/config/type'
import service from '@/api/config/request'
import { Permission } from '@/api/menu'

export interface IRoleAccess {
  id: number
}

export type IRoleAccessList = IRoleAccess[]

export const getPermissionApi: () => Promise<ApiResponse<Permission>> = () => {
  return service.get(`/auth/user/permissions`, {
    params: {
      platform: 2
    }
  })
}
