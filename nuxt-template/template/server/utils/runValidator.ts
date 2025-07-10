import type { H3Event } from 'h3'
import type { ZodType } from 'zod'

export const runValidator = async <T>(schema: ZodType<T>, evt: H3Event, msg: string = '') => {
  const result = await readValidatedBody(evt, (body) => schema.safeParse(body))
  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: msg || result.error.format()._errors[0],
      data: result.error.format()
    })
  }
  return result
}
