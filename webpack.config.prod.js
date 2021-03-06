const path = require('path');
const webpack = require('webpack')

const basedir = path.join(__dirname, './');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      },
      xhtml: true
})


module.exports = {
  entry: {
    'xdLocalStorage': './app/scripts/main.js'
  },
  output: {
    path: path.join(basedir,'/dist'),
    filename: '[name].min.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/ ,
        query: {
          presets: ['es2015'],
        }
      },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    HtmlWebpackPluginConfig,
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]
}
