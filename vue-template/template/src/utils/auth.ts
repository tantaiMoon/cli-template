import axios from 'axios'

export const TOKEN = 'v3-admin-token'
export const R_TOKEN = 'v3-admin-refresh_token'

export let isRefreshToken = false
const refreshSubscribers: Array<any> = []

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN, token)
}
export const getToken = () => {
  return localStorage.getItem(TOKEN)
}
export const removeToken = () => {
  return localStorage.removeItem(TOKEN)
}
export const setRefreshToken = (token: string) => {
  localStorage.setItem(R_TOKEN, token)
}
export const getRefreshToken = () => {
  return localStorage.getItem(R_TOKEN)
}
export const removeRefreshToken = () => {
  return localStorage.removeItem(R_TOKEN)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => {
    callback(token)
  })
}

// 订阅重新获取 token后需要刷新的接口
export function subscribeTokenRefresh(callback: (...arg: any[]) => any) {
  refreshSubscribers.push(callback)
}

export const refreshToken = async () => {
  console.log(isRefreshToken)
  if (!isRefreshToken) {
    isRefreshToken = true
    try {
      const result = await axios({
        method: 'POST',
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/auth/refresh/token',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { refreshToken: getRefreshToken() }
      })
      const data = await result.data
      if (data.success) {
        setToken(data.data?.access_token)
        onRefreshed(data.data?.access_token)
        return true
      } else {
        removeRefreshToken()
        removeToken()
        return false
      }
    } catch (e) {
      removeRefreshToken()
      removeToken()
      return false
    } finally {
      isRefreshToken = false
    }
  }
}
