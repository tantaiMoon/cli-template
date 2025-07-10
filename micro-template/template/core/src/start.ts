import { MoyiCustomEvent } from '@/customevent'
import { prefetch } from '@/loader/prefetch'
import { currentApp } from './utils'
import { getAppList, setAppList, setMainLifeCycle } from './const'
import type { SubAppProps, LifeCycleProps } from './const'
import { rewriteRouter } from './router/rewriteRouter'

const custom = new MoyiCustomEvent()
window.custom = custom
rewriteRouter('/')
export const registerMicroApps = (appList: SubAppProps[], lifeCycle: LifeCycleProps) => {
  // console.log('registerApp')
  // 注册子应用
  setAppList(appList)
  // 设置生命周期
  setMainLifeCycle(lifeCycle)

}

// 启动微前端方法
export const start = () => {
  console.log('start')
  const apps = getAppList()
  if (apps?.length === 0) {
    console.error('no apps found')
    return
  }

  // 查找符合当前路由的 子应用
  const app = currentApp()
  if (app) {
    const { pathname, hash } = window.location
    const url = `${ pathname }${ hash }`
    window.history.pushState(null, '', url)
    window.__MOYI_CHILD_APP__ = app.activeRule
  }
  // 预加载 加载所有子应用但是不显示
  prefetch()
}
