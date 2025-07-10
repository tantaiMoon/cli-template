
let defaultValue: Record<string, any> = {} // 子应用沙箱容器
export class ProxySandbox {
  proxy: any
  constructor() {
    this.proxy = null
    this.active()
  }

  active() {
    // 子应用需要设置属性
    this.proxy = new Proxy(window, {
      get: (target: any, key: any) => {
        if (typeof target[key] === 'function') {
          return target[key].bind(target)
        }
        return defaultValue[key] || target[key]
      },
      set: (target: any, key: any, value: any) => {
        defaultValue[key] = value
        return true
      }
    })
  }
  inactive() {
    defaultValue = {}
  }
}
