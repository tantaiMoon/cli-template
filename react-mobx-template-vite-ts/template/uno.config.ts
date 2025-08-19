import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}']
  },
  presets: [
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetUno()
  ],
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
  rules: [
    [/^w-(.+)$/, ([, s]) => ({ width: `${s}` })],
    [/^lh-(\d+)$/, ([, d]) => ({ 'line-height': `${d}` })],
    [/^lh-(\d+)px$/, ([, d]) => ({ 'line-height': `${d}px` })],
    [/^fz-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^fz-(\d+)px$/, ([, d]) => ({ 'font-size': `${d}px` })]
  ],
  shortcuts: [
    { logo: 'i-logos-react w-6em h-6em transform transition-800 hover:rotate-180' },
    { 'f-c': 'flex items-center' }
  ]
})
