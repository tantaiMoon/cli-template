const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

let nodeEnv = process.env.NODE_ENV || 'development'

const envList = ['.env', `.env.${nodeEnv}`, `.env.local`]

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

module.exports = () =>
  import('@unocss/webpack').then(({ default: UnoCSS }) => {
    console.log(UnoCSS)
    return {
      entry: path.resolve(__dirname, '..', 'src', 'main.ts'),
      output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'js/[name].bundle-[contenthash:8].js',
        clean: true,
        publicPath: '/'
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.vue', '.js', 'jsx', 'json'],
        alias: {
          '@': path.resolve(__dirname, '..', 'src')
        }
      },
      optimization: {
        realContentHash: true
      },
      plugins: [
        UnoCSS({
          configFile: '../uno.config.ts'
        }),
        new HtmlWebpackPlugin({
          inject: 'body',
          // 指定 html 模板的路径
          template: path.resolve(__dirname, '..', 'public', 'index.html'),
          // 该配置会注入到 html 文件的模板语法中
          title: process.env.APP_TITLE
        }),
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css'
        }),
        new webpack.DefinePlugin({
          'process.env': {
            APP_API_URI: JSON.stringify(process.env.APP_API_URI)
          }
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, '..', 'public'),
              to: path.resolve(__dirname, '..', 'dist'),
              toType: 'dir',
              info: {
                minimized: true
              },
              globOptions: {
                ignore: ['**/index.html', '**/.DS_Store']
              }
            }
          ]
        }),
        new VueLoaderPlugin()
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  appendTsSuffixTo: [/\.vue$/]
                }
              },
              {
                loader: 'babel-loader'
              }
            ]
          },
          // webpack5处理图片相关的静态资源
          {
            test: /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/,
            // 使用 webpack5 覅人新特性，不再需要使用loader去进行处理
            // 而且 assets 是 webpack5 通用的资源处理类型
            // 默认情况下 8kb 以下的资源会被转化为 base64 编码
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 自定义 10 kb 以下的资源会被转化为 base 64 位编码
                maxSize: 10 * 1024
              }
            },
            generator: {
              // 输出图片的目录
              // outputPath: "images",
              // 输出图片的名称
              filename: 'images/[name].[contenthash:6].[ext]'
            }
          },
          // svg 类型的静态资源期望转为为 asset/resource 类型进行处理
          {
            test: /\.(svg)(\?.*)?$/,
            // 默认会将构建结果导出单独的配置文件
            type: 'asset/resource',
            generator: {
              // 输出 svg 的目录
              // outputPath: "images",
              // 输出 svg 的名称
              filename: 'svgs/[name].[contenthash:6].[ext]'
            }
          }
        ]
      }
    }
  })
