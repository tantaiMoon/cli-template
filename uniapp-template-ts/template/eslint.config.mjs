import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject
} from '@vue/eslint-config-typescript'
import perttierPlugin from 'eslint-plugin-prettier'
import perttier from '@vue/eslint-config-prettier'

configureVueProject({
  // 是否在Vue模板中解析TypeScript语法。
  // 默认为`true`。
  // 设置为`false`可能会提高性能。
  // 但Vue模板中的TypeScript语法将导致语法错误。
  // 此外，类型感知规则将不会应用于模板中的表达式。
  tsSyntaxInTemplates: true,

  // 可选：指定`.vue`文件中的脚本语言
  // 默认为`['ts']`。
  scriptLangs: ['ts', 'js'],

  // 根目录
  // 默认为`process.cwd()`
  rootDir: import.meta.dirname
})

export default defineConfigWithVueTs(
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']),

  pluginVue.configs['flat/essential'],

  // 我们强烈建议您从`recommended`或`recommendedTypeChecked`开始。
  // 但如果您决定自己配置所有规则，
  // 可以从`base`开始，然后根据需要打开/关闭规则。
  vueTsConfigs.recommendedTypeChecked,
  perttier,
  {
    name: 'app',
    plugins: {
      prettier: perttierPlugin
    },
    rules: {
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ],
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
