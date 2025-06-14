module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended'
    // './.eslintrc-auto-import.json'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '.prettierrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': [
      'off',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        bracketSpacing: true,
        trailingComma: 'none',
        arrowParens: 'avoid',
        jsxSingleQuote: false, // jsx不使用单引号,而使用双引号
        requirePragma: false, // 不需要写文件开头的 @prettier
        insertPragma: false, // 不需要自动在文件开头插入 @prettier
        proseWrap: 'preserve', // 使用默认的折行标准
        htmlWhitespaceSensitivity: 'css'
      }
    ],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/ban-ts-comment': [0]
  }
}
