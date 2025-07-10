import type { SubAppProps } from '@/const'
import { sandBox } from '@/sandbox'
import { fetchResources } from '@/utils/fetch-resources'

const cache: Record<string | number | symbol, any> = {} // 根据子应用的 name 来做缓存

export const loadHTMML = async (app: SubAppProps) => {
  // 子应用显示在哪（container 容器）
  let container = app.container
  // 子应用的入口
  let entry = app.entry
  const [html, scripts] = await parseHTML(entry, app.name)
  const htmlNode = document.querySelector(container) as HTMLElement
  if (!htmlNode) {
    throw new Error(`Could not dom from ${ container }`)
  }
  htmlNode.innerHTML = html
  scripts.forEach((script: any) => {
    sandBox(app, script)
  })
  return app
}

export const parseHTML = async (entry: string, appName: string) => {
  if (cache[appName]) return cache[appName]
  const html = await fetchResources(entry)
  const div = document.createElement('div')
  div.innerHTML = html
  let allScript = []
  // 标签，link ， script(src, js code)
  const [dom, scriptUrl, scriptCode] = await getResources(div, entry)
  const fetchedScripts = await Promise.all(scriptUrl.map(async (item: any) => await fetchResources(item)))
  allScript = scriptCode.concat(fetchedScripts)
  cache[appName] = [dom, allScript]
  return [dom, allScript]
}

export const getResources = async (root: any, entry: string) => {
  const scriptUrl: any[] = []
  const scriptCode: any[] = []
  const dom = root.outerHTML

  function deepparse(element: any) {
    const children = element.children
    const parent = element.parent
    if (element.nodeName.toLowerCase() === 'script') {
      const src = element.getAttribute('src')
      if (!src) {
        scriptCode.push(element.outerHTML)
      } else {
        if (src.startsWith('http')) {
          scriptUrl.push(src)
        } else {
          scriptUrl.push(`http:${ entry }/${ src }`)
        }
      }
      if (parent) {
        parent.replaceChild(document.createComment('file is replaced'), element)
      }
    }

    //
    if (element.nodeName.toLowerCase() === 'link') {
      const href = element.getAttribute('href')
      if (href.endsWith('.js')) {
        if (href.startsWith('http')) {
          scriptUrl.push(href)
        } else {
          scriptUrl.push(`http:${ entry }/${ href }`)
        }
      }
    }

    for (let i = 0; i < children.length; i++) {
      deepparse(children[i])
    }
  }

  deepparse(root)
  return [dom, scriptUrl, scriptCode]
}
export const loadCss = async (app: any) => {
}
