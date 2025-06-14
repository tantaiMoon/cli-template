import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

/** @type {import('eslint').Linter.Config[]} */
export default withNuxt([
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{vue,ts}'], languageOptions: { parserOptions: { parser: tseslint.parser } }, rules: {
      'vue/multi-word-component-names': ['off'],
      '@typescript-eslint/no-explicit-any': ['warn']
    }
  },
  {
    ignores: ['node_modules', 'dist', 'public', '.nuxt', '.output']
  },
  prettierConfig
])
