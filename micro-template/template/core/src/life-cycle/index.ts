import { getMainLifeCycle, type SubAppProps } from '@/const'
import { loadHTMML } from '@/loader'
import { findAppByRoute } from '@/utils'

export const runMainLifeCycle = async (type: 'bootstrap' | 'mounted' | 'unmounted') => {
  const mainLifeCycle = getMainLifeCycle()
  const lifeCycle = mainLifeCycle[type] as Function[]

  if (lifeCycle?.length) {
    await Promise.all(lifeCycle.map(async (fn: Function) => await fn()))
  }
}

export const bootstrap = async (app: SubAppProps) => {
  // 执行主应用生命周期
  await runMainLifeCycle('bootstrap')
  // 执行子应用生命周期
  app?.bootstrap?.({
    props: app.props,
    entry: app.entry
  })
  // 加载子应用
  const appContext = await loadHTMML(app)
  await appContext?.bootstrap?.()
  return appContext
}

export const mounted =async  (app: SubAppProps) => {
  app?.mounted?.({
    props: app.props,
    entry: app.entry
  })
  // 执行主应用生命周期
  await runMainLifeCycle('mounted')
}

export const unmounted = async (app: SubAppProps) => {
  if (app?.unmounted) {
    app.unmounted({
      props: app.props,
      entry: app.entry
    })
  }
  // 执行主应用生命周期
  await runMainLifeCycle('mounted')
}

export const lifecycle = async () => {
  // 获取上一个子应用
  const prevApp = findAppByRoute(window.__MOYI_ORIGIN_APP__) //window.__MOYI_CHILD_APP__
//   获取要跳转的子应用
  const nextApp = findAppByRoute(window.__MOYI_CHILD_APP__)

  if (!nextApp) {
    return
  }
  if (prevApp?.unmounted) {
    await unmounted(prevApp)
  }
  if (prevApp?.proxy) {
    prevApp.proxy.inactive()
  }
  const app = await bootstrap(nextApp)
  await mounted(app)
}
