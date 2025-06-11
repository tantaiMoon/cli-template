import { IMemuMap, IMenu } from '@/api/menu'

export const generateTree = (list: IMenu[], withMeta = false) => {
  const map = list.reduce((memo, current) => {
    const temp: IMenu = { ...current, children: [] }
    if (withMeta) {
      temp.meta = {
        title: current.title || current.name,
        icon: current.icon
      }
    }
    memo[current.id!] = temp
    return memo
  }, {} as IMemuMap)
  const tree: IMenu[] = []
  for (const item of list) {
    const pid = item.parent?.id
    const cur = map[item.id!]
    if (pid) {
      const parent = map[pid]
      if (parent) {
        const children = parent?.children || []
        children.push(cur)
        parent.children = children
        continue
      }
    }
    tree.push(cur)
  }
  return tree
}
