import { SetMetadata } from '@nestjs/common'

// 策略元数据键
export const POLICY_KEY = 'POLICY_DECORATOR'

// 装饰器实现
export const Policy = (options: PolicyOptions | string) => {
  // 支持简写形式（直接传资源字符串）
  if (typeof options === 'string') {
    return SetMetadata(POLICY_KEY, { subject: options })
  }

  // 完整策略配置
  return SetMetadata(POLICY_KEY, {
    subject: options.subject,
    action: options.action || '*',
    conditions: options.conditions
  })
}

// 类型定义
export interface PolicyOptions {
  type: number // 策略类型 (0: 静态策略, 1: 动态策略)
  effect: string // 策略效果 (allow/deny)
  subject: string // 受保护资源 (例: 'article')
  action: string // 操作类型 (create/read/update/delete/manage)
  fields?: string[] | string // 受保护字段 (例: ['title', 'content'])
  fields_data?: string[] | string // 受保护字段数据 (例: ['title', 'content'])
  args?: any
  conditions?: any // 动态条件 (例: 'authorId == userId')
}
