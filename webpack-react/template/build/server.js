const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.dev')

const app = express()
const compiler = webpack(config)
console.log(config)
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
)

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.APP_PORT}`)
})
