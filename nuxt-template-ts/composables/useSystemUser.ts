export interface UserProps {
  isLogin: boolean
  username?: string
  id?: number
  token?: string

}
export const USER_STATE_KEY = 'systemuser'
// 设置全局状态
export const useSystemUseer = () => {
  return useState<UserProps>(USER_STATE_KEY, () => ({
    isLogin: false
  }))
}
