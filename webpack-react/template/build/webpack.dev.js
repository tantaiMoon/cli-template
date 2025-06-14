const { merge } = require('webpack-merge')
const fs = require('fs')
const dotenv = require('dotenv')
const config = require('./webpack.config')
const path = require('path')
const envList = ['.env', `.env.development`, `.env.local`]

// 读取当前构建环境对应的环境变量文件的所有内容，将其注入到环境变量中
envList.forEach((env) => {
  const envFilePath = path.resolve(__dirname, '..', env)
  const envFileExists = fs.existsSync(envFilePath)
  if (envFileExists) {
    dotenv.config({
      path: envFilePath
    })
  }
})
console.log(config)
module.exports = async () => {
  return merge(await config(), {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(c|sc)ss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: (loader) => [require('autoprefixer')()]
                }
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    devServer: {
      hot: true,
      port: Number(process.env.APP_PORT || 3000),
      historyApiFallback: true
      // static: './dist'
    }
  })
}
