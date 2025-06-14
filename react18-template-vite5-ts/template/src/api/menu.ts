import request from './request.ts'
import * as api from '@/api/config'

export const getMenus = (roleIds: string[]) => {
  return request.get<any, Record<string, any>>(api.menuApi.MENU_API, {
    params: {
      roleIds
    }
  })
}
