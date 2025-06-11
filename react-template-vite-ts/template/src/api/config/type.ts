export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface IPagination {
  page: number
  size: number
  total: number
  pages: number
}

export type IResponseList<T = unknown> = ApiResponse<{
  records: T[]
  pages: IPagination
}>
