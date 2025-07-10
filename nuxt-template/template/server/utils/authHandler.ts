import type { EventHandler } from 'h3'

export default function defineAuthResponseHandler(handler: EventHandler) {
  return defineEventHandler(async (evt) => {
    // do something before the route handler
    const { user } = useSystemUser()
    if (!user.isLogin) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const response = await handler(evt)
    // after the route handler
    return {
      ...response
    }
  })
}
