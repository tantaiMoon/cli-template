// 路由补丁
import { getAppList, type SubAppProps } from '@/const'

/**
 *  路由补丁
 * @param globalEvent  原生事件
 * @param eventName  事件名称
 * @returns 
 */
export const patchRouter = (globalEvent: Function, eventName: string) => {
  return function () {
    // 
    const e = new Event(eventName)
    // @ts-ignore
    globalEvent.apply(this, arguments)
    window.dispatchEvent(e)
  }
}


export const currentApp = () => {
  const currentUrl = window.location.pathname
  return filterSubApp('activeRule', currentUrl)
}


export const filterSubApp = (key: string, value: string) => {
  const currentApp = getAppList().filter(app => (app as any)[key] === value)
  return currentApp?.length ? currentApp[0] : {} as SubAppProps
}

export const findAppByRoute = (route: any) => {
  return filterSubApp('activeRule', route)
}

/**
 * description:
 * @return {boolean}
 */
export const isTurnChild =(): boolean => {
  window.__MOYI_ORIGIN_APP__ = window.__MOYI_CHILD_APP__
  if (window.__MOYI_CHILD_APP__ === window.location.pathname) {
    return false
  }
  const currentApp = window.location.pathname.match(/\/(\/\w+)/)
  if (!currentApp) {
    return false
  }
  window.__MOYI_CHILD_APP__ = currentApp[0]
  return true
}


