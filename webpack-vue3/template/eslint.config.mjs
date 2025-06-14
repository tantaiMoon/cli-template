import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPrettier from 'eslint-config-prettier'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{vue,ts}'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      'vue/multi-word-component-names': 0
    }
  },
  {
    ignores: ['node_modules', 'dist', 'public', 'config']
  },
  eslintPrettier
]
