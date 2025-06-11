import { ApiResponse } from '@/api/config/type.ts'
import service from '@/api/config/request.ts'
import { Permission } from '@/api/menu.ts'

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
