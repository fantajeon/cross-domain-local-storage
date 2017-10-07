const path = require('path');
const webpack = require('webpack')
const basedir = path.join(__dirname, './');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/index.html',
      filename: 'index.html',
      inject: 'body'
})


module.exports = {
  entry: {
    'xdLocalStoragePostMessageApi': './app/scripts/xdLocalStoragePostMessageApi.js',
    'xdLocalStorage': './app/scripts/xdLocalStorage.js'
  },
  output: {
    path: path.join(basedir,'/dist'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false
    }),
    HtmlWebpackPluginConfig
  ]
}
