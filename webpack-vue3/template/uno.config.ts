import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({
      // 开启属性模式
      prefix: 'un-',
      strict: true,
      prefixedOnly: false // 是否只启用带前缀的模式
    }),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerAttributifyJsx()], // 图标别名简拼
  shortcuts: [['icon', 'inline-block w-1em h-1em align-middle text-current']],
  rules: [
    [/^wpt-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ width: `${d}%` })],
    [/^hpt-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ height: `${d}%` })],
    [/^fs-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^leh-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ 'line-height': `${d}` })]
  ],
  content: {
    filesystem: ['**/*.{html,ts,js,tsx,jsx,vue,svelte,astro}']
  }
})
