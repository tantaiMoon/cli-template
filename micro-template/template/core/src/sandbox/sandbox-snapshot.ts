
export class SnapshotSandbox {
  private snapshot: Map<any, any> | undefined
  private proxy: Window
  constructor () {
    this.proxy = window
    this.active()
  }
  // 激活沙箱
  active(){
    this.snapshot = new Map()
    // 遍历window，设置属性
    for (const key in window) {
      this.snapshot.set(key, window[key])
      // this.snapshot[key] = window[key]
    }
  }
  // 销毁
  inactive(){
    for (const key in window) {
      // if (window[key] !== this.snapshot[key]) {
      //   window[key] = this.snapshot[key]
      // }
      if (window[key] !== this.snapshot?.get(key)) {
        window[key] = this.snapshot?.get(key)
      }
    }
  }
}
