import type { UserDataProps } from '~/server/models/user'

export interface UserProps extends UserDataProps {
  isLogin: boolean
}
export const USER_STATE_KEY = 'systemuser'
// 设置全局状态
export const useSystemUser = () => {
  const user = useState<UserProps>(USER_STATE_KEY, () => ({
    isLogin: false
  }))
  const setUser = (newValue: Partial<UserProps>) => {
    user.value = {
      ...user.value,
      ...newValue
    }
  }
  return {
    user: readonly(user),
    setUser
  }
}
