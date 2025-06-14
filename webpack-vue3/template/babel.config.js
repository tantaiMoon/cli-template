module.exports = {
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-optional-chaining'
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true
      }
    ]
  ]
}
