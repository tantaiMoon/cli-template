import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'
import prettierConfigPlugin from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'config', 'node_modules', 'public', '.devops', 'src/assets'] },

  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      pluginPromise.configs['flat/recommended'],
      prettierConfigPlugin
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser', // Forward to TypeScript parser
        project: './tsconfig.app.json', // Path to your tsconfig
        tsconfigRootDir: import.meta.dirname, // Root directory
        extraFileExtensions: ['.vue'] // Allow .vue files
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.tsx', '.ts', '.js', '.json', '.scss', '.css']
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json'
        },
        node: true
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // promise
      'promise/always-return': 'warn',
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
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          amd: true,
          ignore: ['^uno.css$', '^~uno.css$', '^virtual:uno.css$']
        }
      ],
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-nodejs-modules': 'off'
    }
  }
)
