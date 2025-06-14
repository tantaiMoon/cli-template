const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => import('@unocss/webpack').then(({ default: UnoCSS }) => ({
  entry: path.resolve(__dirname, '..', 'src', 'main.tsx'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'js/[name].bundle-[contenthash:8].js',
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    }
  },
  optimization: {
    realContentHash: true
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'), // 使用相对路径
      inject: 'body',
      title: process.env.APP_TITLE
    }),
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: 'css/[name][contenthash:8].css',
      chunkFilename: '[id].css'
    }),
    UnoCSS()
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'fonts/[name].[ext]' // 文件输出目录和命名
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'medias/[name].[ext]' // 文件输出目录和命名
        }
      }
    ]
  }
}))
