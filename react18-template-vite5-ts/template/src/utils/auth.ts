export const TOKEN = 'token'
export const REFRESH_TOKEN = 'refreshToken'

export const getToken = () => localStorage.getItem(TOKEN)
export const removeToken = () => localStorage.removeItem(TOKEN)
export const setToken = (token: string) => localStorage.setItem(TOKEN, token)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN)
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN)
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN, token)
