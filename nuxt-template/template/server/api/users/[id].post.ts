export default defineEventHandler(async (evt) => {
  // 获取 路由 params 参数
  const id = getRouterParam(evt, 'id')
  // 获取路由 query 查询参数
  const query = getQuery(evt)
  // 获取 body 请求体
  const body = await readBody(evt)

  return Promise.resolve({
    name: 'user name',
    id,
    query,
    ...(body || {}),
    method: 'post - useid'
  })
})
