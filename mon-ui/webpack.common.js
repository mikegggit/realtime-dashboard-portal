const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractFixedDataTable2 = new ExtractTextPlugin('foo.css');

module.exports = {

  entry: './src/main.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.css' ],
    alias: {
      fixeddatatable2: path.resolve(__dirname, 'node_modules/fixed-data-table-2/dist/'),
    }
  },
  module: {
    rules: [
      // Images
      {
        test: /\.png$/,
        use: [
          { 
            loader: 'url-loader',
            options: {
              limit: 25000 
            }
          }
        ]
      },
      // App styles
      {
        test: /\.css$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules/react-toolbox')
        ],
        exclude: [
          path.join(__dirname, 'src/public/css')
        ],
        use: [
          { loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ]
      },
      // Vendor styles shouldn't be loaded as modules
      {
        test: /\.css$/,
        include: [ 
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'src/public/css')
        ],
        exclude: [ path.join(__dirname, 'node_modules/react-toolbox') ],
        use: [
          { loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false
            }
          }
        ]
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          { loader : 'babel-loader' }
        ]
      },
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/index.html'
      }
    ]),
    new ExtractTextPlugin({
      filename: 'mon.bundle.css',
      allChunks: true,
    }),
  ]
}
