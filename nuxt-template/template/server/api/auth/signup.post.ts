import bcrypt from 'bcrypt'

import { UserSchema } from '~/server/models/user'
import { userSignupSchema } from '~/validators/user'

export default defineEventHandler(async (evt) => {
  const result = await runValidator(userSignupSchema, evt)
  const config = useRuntimeConfig()
  const { username, password } = result.data
  const user = await UserSchema.find({ username }).lean()
  if (user.length) {
    throw createError({
      statusCode: 409,
      statusMessage: '用户名被占用'
    })
  }
  const hash = await bcrypt.hash(password, config.bcrypt.saltRounds)
  const useCrewateData = {
    username,
    password: hash
  }
  const newUser = await UserSchema.create(useCrewateData)
  return newUser
})
