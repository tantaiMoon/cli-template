import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(() => {
  const storage = useStorage()
  const { redis } = useRuntimeConfig()
  const driver = redisDriver({
    ...redis
  })
  storage.mount('redis', driver)
})
