import { useSystemUser } from '~/composables/useSystemUser'

export const TOKEN = 'NUXT_TOKEN'
export const RE_TOKEN = 'RE_TOKEN'

export function getToken() {
  return localStorage.getItem(TOKEN)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN)
}

export function getRefreshToken() {
  return localStorage.getItem(RE_TOKEN)
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(RE_TOKEN, refreshToken)
}

export function removeRefreshToken() {
  localStorage.removeItem(RE_TOKEN)
}

export default defineNuxtRouteMiddleware((to) => {
  if (!isAuth()) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }
})

function isAuth() {
  const { user } = useSystemUser()
  return user.value.isLogin
}
