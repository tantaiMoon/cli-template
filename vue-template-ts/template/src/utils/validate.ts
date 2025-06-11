export const isExternal = (path: string) => {
  return /https?:\/\//.test(path)
}
