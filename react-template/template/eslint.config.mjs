// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfigPlugin from 'eslint-config-prettier'
import prettier from 'prettier'

export default [
  // 基础 JavaScript 推荐配置
  js.configs.recommended,

  // TypeScript 推荐配置
  ...tseslint.configs.recommended,
  prettierConfigPlugin,

  // Vue 基础配置
  ...pluginVue.configs['flat/essential'],

  // 全局配置
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.electron
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },

  // TypeScript 文件特定配置
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off', 'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ]
    }
  },

  // Vue 文件特定配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ]
    }
  },

  // Prettier 配置
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          ...(await prettier.resolveConfig(process.cwd())), // 加载项目根目录的 Prettier 配置
          endOfLine: 'lf' // 可选：自动处理换行符
        }
      ],
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ]
    }
  },

  // 忽略文件
  {
    ignores: ['dist/', 'node_modules/', 'build/', '.vite/', '.husky/', '.git/']
  }
]
