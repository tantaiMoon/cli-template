import cssFunc from 'css-color-function'

const formula: { [prop: string]: string } = {
  'primary-light-1': 'color(themeName tint(10%))',
  'primary-light-2': 'color(themeName tint(20%))',
  'primary-light-3': 'color(themeName tint(30%))',
  'primary-light-4': 'color(themeName tint(40%))',
  'primary-light-5': 'color(themeName tint(50%))',
  'primary-light-6': 'color(themeName tint(60%))',
  'primary-light-7': 'color(themeName tint(70%))',
  'primary-light-8': 'color(themeName tint(80%))',
  'primary-light-9': 'color(themeName tint(90%))'
}
export const generateColors = (primary: string) => {
  const colors: Record<string, string> = {}
  Object.entries(formula).forEach(([key, v]) => {
    const value = v.replace(/themeName/g, primary)
    colors[key] = cssFunc.convert(value)
  })
  return colors
}

export const setColors = (colors: Record<string, string>) => {
  const el = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    el.style.setProperty(`--ant-color-${key}`, value)
  })
}
