const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'src')
const APP_DIR = path.resolve(__dirname, 'src/app')

const config = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less']
  }
}

module.exports = config
