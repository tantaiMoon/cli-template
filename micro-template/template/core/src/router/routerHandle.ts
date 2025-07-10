import { lifecycle } from '@/life-cycle'
import { isTurnChild } from '@/utils'

export const turnApp = async (...args: IArguments[]) => {
  const isTurn = isTurnChild()
  if (isTurn) {
    // 路由切换,微前端生命周期
    await lifecycle()
  } else {
    // 路由未切换
  }
}
