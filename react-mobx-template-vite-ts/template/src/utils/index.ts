// eslint-disable-next-line
type TreeType<T = Record<string, any>> = {
  children?: TreeType<T>[]
  id?: string
  path?: string
  label?: string
  title?: string
  parentId?: string
}
export const listToTree = <T = Record<string, unknown>>(
  list: TreeType<T>[],
  { label }: { label: keyof TreeType<T> }
) => {
  const tree: TreeType<T>[] = list.slice(0).map((item) => {
    return {
      ...item,
      label: item[label],
      value: item['id' as keyof TreeType<T>],
      children: [] as TreeType<T>
    } as unknown as TreeType<T>
  })
  for (const item of tree.slice(0)) {
    const children = tree.filter((v) => v.parentId === item.id)
    if (children.length) {
      item.children = children
    }
  }
  return tree.slice(0).filter((v) => !v.parentId || v.parentId === '0')
}

export const treeToList = <T = Record<string, unknown>>(tree: TreeType<T>[]) => {
  const list: TreeType<T>[] = []
  const innerFn = (tree: TreeType<T>[]) => {
    for (const item of tree) {
      list.push(item)
      if (item?.children?.length !== 0) {
        innerFn(item.children?.slice(0) ?? [])
        item.children = []
      }
    }
  }
  innerFn(tree.slice(0))
  return list
}

export const filterTree = <T>(tree: TreeType<T>[], list: string[]) => {
  const originalList = treeToList(tree)
  const newList = originalList
    .slice(0)
    .filter((v) => list.find((item) => item === v.id || v.path === item))
  return listToTree(newList.slice(0), { label: 'title' })
}
