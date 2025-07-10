import type { LifeCycleProps, SubAppProps } from '@/const'
import { performScriptForEval, performScriptForFunction } from '@/sandbox/perform-script'
import { SnapshotSandbox } from '@/sandbox/sandbox-snapshot'
import { ProxySandbox } from '@/sandbox/sandbox-proxy'

const isCheckLifeCycle = (lifecycle: LifeCycleProps) => {
  return lifecycle?.mounted && lifecycle?.bootstrap && lifecycle?.unmounted
}

export const sandBox = (app: SubAppProps, script: string) => {
  // const proxy = new SnapshotSandbox()
  const proxy = new ProxySandbox()
  if (!app.proxy) {
    app.proxy = proxy
  }
  // 设置环境变量
  window.__MOYI_MICRO_WEB__ = true
  console.log('sandbox')
  const lifecycle = performScriptForFunction(script, app.name, app.proxy.proxy)
  // const lifecycle = performScriptForEval(script, app.name)
  // 执行子应用生命周期，挂载到应用
  if (isCheckLifeCycle(lifecycle)) {
    app.mounted = lifecycle.mounted
    app.bootstrap = lifecycle.bootstrap
    app.unmounted = lifecycle.unmounted
  }
}
