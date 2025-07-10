import { getAppList } from '@/const'
import { parseHTML } from './index'

export const prefetch = async () => {
  // 获取所有子应用列表，不包括当前显示的
  const appList = getAppList().filter(item => !window.location.pathname.startsWith(item.activeRule))
//   加载剩余所有的子应用
  await Promise.all(appList.map(async item => await parseHTML(item.entry, item.name)))
}
