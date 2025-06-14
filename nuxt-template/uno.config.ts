import {
  defineConfig,
  transformerAttributifyJsx,
  transformerDirectives,
  presetUno,
  presetIcons,
  presetAttributify
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetAttributify()],
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
  shortcuts: [{ 'f-center': 'flex items-center' }],
  rules: [
    [/^len-(\d+)$/, ([, d]) => `line-height: ${d}`],
    [/^len-(\d+)px$/, ([, d]) => `line-height: ${d}px`],
    [/^fs-(\d+)$/, ([, d]) => `font-size: ${d}px`]
  ]
})
