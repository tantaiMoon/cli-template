import jwt from 'jsonwebtoken'

export default defineEventHandler(async (evt) => {
  // 根据路由匹配规则，对指定路由进行特定的处理
  const routeReg = /\/(catpcha|check|auth)/
  if (evt.path.startsWith('/api/auth') || routeReg.test(evt.path)) {
    return
  }
  const config = useRuntimeConfig()
  const token = getCookie(evt, 'token')
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorizaed'
    })
  }
  try {
    const userData = jwt.verify(token, config.jwt.secret)
    evt.context.user = userData
  } catch {
    deleteCookie(evt, 'token')
    throw createError({
      statusCode: 401,
      statusMessage: '登录令牌已失效'
    })
  }
})
