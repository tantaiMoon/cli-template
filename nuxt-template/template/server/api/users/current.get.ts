export default defineEventHandler(async (evt) => {
  // const config = useRuntimeConfig()
  const { user } = evt.context
  const currentUserData = await UserSchema.findOne({ username: user.username }).exec()
  return currentUserData!.toJSON()
})
