const webpackBase = require('./webpack.config')
const { merge } = require('webpack-merge')

module.exports = async () =>
  merge(await webpackBase(), {
    mode: 'development',
    module: {
      rules: [
        {
          test: /.\.module\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: { namedExport: false } // 仅为此文件启用 CSS Modules
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(c|sc)ss$/,
          exclude: /.\.module\.scss$/,
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
      port: Number(process.env.APP_PORT),
      historyApiFallback: true,
      hot: true,
      proxy: [
        {
          context: ['/dev-api'],
          target: 'http://localhost:41000',
          // target: 'http://49.233.13.91:41000',
          changeOrigin: true,
          secure: false, // https
          pathRewrite: { '^/dev-api': 'api' },
          // 添加以下配置
          logLevel: 'debug', // 用于调试
          onProxyReq(proxyReq, req, res) {
            // 可以在这里修改请求头
            console.log('Proxying:', req.method, req.url)
          },
          onProxyRes(proxyRes, req, res) {
            // 可以在这里处理响应
            console.log('Received:', proxyRes.statusCode, req.url)
          }
        }
      ]
    }
  })
