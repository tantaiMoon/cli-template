import protectedRoute from '~/server/protectedRoute'

export default defineEventHandler(async (evt) => {
  await protectedRoute(evt)
  // 获取 路由 params 参数
  const id = getRouterParam(evt, 'id')
  // 获取路由 query 查询参数
  const query = getQuery(evt)

  return Promise.resolve({
    name: 'user name',
    id,
    query,
  })
})
