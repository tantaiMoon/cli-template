const access_token = 'MY_APP_TOKEN'
const refresh_token = 'MY_APP_REFRESH_TOKEN'
export const getToken = () => {
  return localStorage.getItem(access_token) ?? 'react-admin'
}

export const setToken = (token: string) => {
  localStorage.setItem(access_token, token)
}

export const removeToken = () => {
  localStorage.removeItem(access_token)
}
export const getRefreshToken = () => {
  return localStorage.getItem(refresh_token) ?? ''
}

export const setRefreshToken = (token: string) => {
  localStorage.setItem(refresh_token, token)
}

export const removeRefreshToken = () => {
  localStorage.removeItem(refresh_token)
}
