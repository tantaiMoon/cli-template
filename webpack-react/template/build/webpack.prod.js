const { merge } = require('webpack-merge')
const fs = require('fs')
const dotenv = require('dotenv')
const config = require('./webpack.config')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const envList = ['.env', `.env.production`]

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

module.exports = async () =>
  merge(await config(), {
    mode: 'production',
    devtool: false,
    module: {
      rules: [
        {
          test: /\.(c|sc)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()]
              }
            },
            'sass-loader'
          ]
        }
      ]
    }
  })
