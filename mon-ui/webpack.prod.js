const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      "API_URLBASE": JSON.stringify("http://nasdaq.com:8080"),
      "VERSION": JSON.stringify(require("./package.json").version),
      'process.env': {
         'NODE_ENV': JSON.stringify('production')
       }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})

