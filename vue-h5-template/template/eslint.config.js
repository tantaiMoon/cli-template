import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import importPlugin from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.vue', '.ts', '.js', '.json', '.scss', '.css']
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json'
        },
        node: true
      }
    },
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ],// promise
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'warn',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      'promise/no-multiple-resolved': 'error',
      // import
      'import/no-unresolved': ['error', { commonjs: true, amd: true }],
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn'
    }
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  pluginPromise.configs['flat/recommended'],
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
])
