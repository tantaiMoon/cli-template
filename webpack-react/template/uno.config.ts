import presetAttributify from '@unocss/preset-attributify'
import presetUno from '@unocss/preset-uno'
import { defineConfig, transformerVariantGroup, transformerAttributifyJsx } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetAttributify(), presetUno(), presetIcons()],
  transformers: [transformerVariantGroup(), transformerAttributifyJsx()], // 图标别名简拼
  shortcuts: [['icon', 'inline-block w-1em h-1em align-middle text-current']],
  rules: [
    [/^fs-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^leh-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ 'line-height': `${d}` })]
  ]
})
