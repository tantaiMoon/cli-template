export interface SubAppProps {
  name: string
  entry: string
  container: string
  activeRule: string
  props?: any
  unmounted?: Function
  mounted?: Function
  bootstrap?: Function
  proxy?: any
}

let subAppList: SubAppProps[] = []

export const setAppList = (appList: SubAppProps[]) => subAppList = appList

export const getAppList = () => subAppList
