
export const fetchResources = async (url: string) => {
  return fetch(url).then(res => res.text())
}
