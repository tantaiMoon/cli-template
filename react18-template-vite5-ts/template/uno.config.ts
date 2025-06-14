import {
  defineConfig,
  transformerDirectives,
  transformerAttributifyJsx,
  presetUno,
  presetAttributify,
  presetIcons
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives(), transformerAttributifyJsx()]
})
