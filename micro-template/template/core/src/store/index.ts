
interface InitState {
  [key: string | number | symbol]: any
}
export const createStore = (initState: InitState = {}) => (() => {
  let store = initState

  const observers: Function[] = [] // 管理所有订阅者

  // 获取 store
  const getStore = () => store

  // 更新 store
  const update = (newState: InitState) => {
    if (newState !== store) {
      // 执行 store 操作
      const oldValue = store
      // 将 store 更新
      store = newState
      // 通知所有订阅者，监听 store 更新
      observers.forEach(async item => await item(oldValue, store))
    }
  }

  // 订阅 store
  const subscribe = (observer: Function) => {
    // 添加订阅者
    observers.push(observer)
    // return () => {
    //   observers.splice(observers.indexOf(observer), 1)
    // }
  }

  return {
    getStore,
    update,
    subscribe
  }
})()
