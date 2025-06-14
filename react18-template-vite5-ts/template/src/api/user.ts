import request from './request.ts'
import * as api from '@/api/config'

export const login = (data: any) => {
  return Promise.resolve(data)
  // return request.post<any, Record<string, any>>(api.userApi.LOGIN, data, {})
}
