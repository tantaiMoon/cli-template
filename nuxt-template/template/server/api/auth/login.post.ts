import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { runValidator } from '~/server/utils/runValidator'
import { userLoginSchema } from '~/validators/user'
import { UserSchema } from '~/server/models/user'

export default defineEventHandler(async (evt) => {
  // getValidatedQuery(evt, query => userLoginSchema.safeParse(query))
  const config = useRuntimeConfig()
  try {
    const result = await runValidator(userLoginSchema, evt, '')
    const { username, password } = result.data
    const user = await UserSchema.findOne({ username }).exec()
    if (!user) {
      throw createError({
        statusCode: 403,
        statusMessage: '用户名或密码错误'
      })
    }
    const isUser = await bcrypt.compare(password, user.password)
    if (!isUser) {
      throw createError({
        statusCode: 403,
        statusMessage: '用户名或密码错误'
      })
    }
    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn
      }
    )
    await useStorage('redis').setItem(
      'user' + user._id,
      {
        user: user.toJSON(),
        token
      },
      { ttl: config.jwt.expiresIn /* 1 hour */ }
    )
    setCookie(evt, 'token', token, { maxAge: config.jwt.expiresIn })
    return {
      user: user.toJSON(),
      token
    }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: (e as any).message
    })
  }
})
