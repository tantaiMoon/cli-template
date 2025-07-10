import { createError } from 'h3'
import type { H3Event } from 'h3'

export default async (evt: H3Event) => {
  const user = await Promise.resolve({
    isLogin: true,
    username: 'moyi',
    path: evt.path
  })
  if (!user.isLogin) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
}
