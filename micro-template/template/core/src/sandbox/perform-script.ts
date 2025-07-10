export const performScriptForFunction = (script: string, appName: string, proxy: Window) => {
  window.proxy = proxy
  const scriptText = `
     return (function(window) {
        ${ script }
        return window['${ appName }']
     })(window.proxy)
  `
  return new Function(scriptText)()
}

export const performScriptForEval = (script: string, appName: string, proxy: Window) => {
  // library （子应用挂载时设置的 library ）
  // appName 获取子应用 window.appName
  window.proxy = proxy
  const scriptText = `
    return (function(window) {
        ${ script }
        return window['${ appName }']
     })(window.proxy )
  `
  const result = eval(scriptText)
  return {
    mounted: result.mounted,
    bootstrap: result.bootstrap,
    unmounted: result.unmounted
  }
}
