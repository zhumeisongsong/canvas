const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'main': './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '',
    filename: '[name].bundle.js',
    chunkFilename: "[chunkhash].[name].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["stage-3", "stage-2", "stage-1", "es2015"],
          plugins: ["autobind-class-methods", "babel-plugin-transform-class-properties"]
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      hash: true,
      inject: true,
      compile: true,
      favicon: false,
      minify: false,
      cache: true,
      showErrors: true,
      chunks: "all",
      excludeChunks: [],
    }),

    new CopyWebpackPlugin([
      {from: 'src/style', to: 'style'},
      {from: 'src/video', to: 'video'},
      {from: 'src/image', to: 'image'}
    ]),

  ]
};