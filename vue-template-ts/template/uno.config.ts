import presetAttributify from "@unocss/preset-attributify"
import presetUno from "@unocss/preset-uno"
import { defineConfig } from "unocss"
import presetIcons from "@unocss/preset-icons"
import transformerDirectives from "@unocss/transformer-directives"

export default defineConfig({
  presets: [presetAttributify(), presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
  // 图标别名简拼
  shortcuts: [["icon", "inline-block w-1em h-1em align-middle text-current"]]
})
