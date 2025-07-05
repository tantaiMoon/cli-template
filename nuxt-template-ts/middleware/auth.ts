import { useSystemUseer } from '~/composables/useSystemUser'

const user = useSystemUseer()
export default defineNuxtRouteMiddleware((to) => {
  if (!isAuth()) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }
})

function isAuth() {
  return user.value.isLogin
}
