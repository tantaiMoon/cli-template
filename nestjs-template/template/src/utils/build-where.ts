// 更灵活的动态条件构建
export function buildWhereClause(filters: Record<string, any>) {
  const where: any = {}
  const OR: any[] = []

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        if (key === 'keyword') {
          // 全局搜索
          OR.push(
            { name: { contains: value, mode: 'insensitive' } },
            { email: { contains: value, mode: 'insensitive' } },
            { title: { contains: value, mode: 'insensitive' } },
            { username: { contains: value, mode: 'insensitive' } }
          )
        } else {
          // 特定字段过滤
          where[key] = value
        }
      } else if (value instanceof Array) {
        OR.push({ [key]: { in: value } })
      }
    }
  })

  // 只有当 OR 数组有内容时才添加 OR 条件
  if (OR.length > 0) {
    where.OR = OR
  }

  return where
}
