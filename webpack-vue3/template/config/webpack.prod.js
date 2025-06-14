const webpackBase = require('./webpack.config')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = async () =>
  merge(await webpackBase(), {
    mode: 'production',
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        openAnalyzer: true,
        generateStatsFile: false,
        statsOptions: null,
        logLevel: 'info'
      })
    ],
    module: {
      rules: [
        {
          test: /.\.module\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
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
            MiniCssExtractPlugin.loader,
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
    optimization: {
      chunkIds: 'named',
      splitChunks: {
        // 任意模块都可以拆分
        chunks: 'all',
        cacheGroups: {
          // 屁用 node_modules 模块：
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            // 不需要重复拆跟 chunk
            reuseExistingChunk: true
          }
        }
      }
    }
  })
