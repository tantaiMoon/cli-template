import globals from 'globals'
import pluginJs from '@eslint/js' // 检验js的规范（推荐）
import tseslint from 'typescript-eslint' // 推荐的 ts规范
import pluginVue from 'eslint-plugin-vue' // 推荐的 vue 规范
import eslintConfigPrettier from 'eslint-config-prettier'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const eslintAutoImport = require('./.eslintrc-auto-import.json')

export default [
  {
    // 校验的文件类型 mjs -》 esModule  cjs -》 commonjs
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    name: 'global',
    languageOptions: {
      // 全局变量
      globals: { ...globals.browser, ...globals.node, ...globals.es2023, ...eslintAutoImport.globals }
    },
    rules: {
      'no-unused-vars': 0
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue', '**/*.ts'], // 校验vue中的ts代码
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    // 自定义规则
    rules: {
      'vue/multi-word-component-names': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'no-console': 1
      // semi: 2,
      // quotes: [2]
    }
  },
  {
    // 哪些文件不通过 eslint 来进行校验
    ignores: ['.css', '*.d.ts', 'dist', 'public', 'node_modules']
  },
  // 代码格式化部分
  eslintConfigPrettier // 覆盖掉 eslint 的规范
]
