
export class MoyiCustomEvent {
  // 事件监听
  on(name: string, cb: any){
    window.addEventListener(name, (e: any) => {
      cb(e.detail)
    })
    // window.addEventListener(name, cb)
  }
  // 发送事件
  emit(name: string, data: any){
    const event = new CustomEvent(name, {
      detail: data
    })
    window.dispatchEvent(event)
  }
}
