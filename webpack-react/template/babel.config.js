module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        "corejs": 3 // 配置使用core-js使用的版本
      }
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"],
  ],
  "plugins": ["@babel/plugin-transform-class-properties","@babel/plugin-transform-optional-chaining", [
    "import",
    {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": true // or 'css'
    },
    "antd"
  ]]
}
