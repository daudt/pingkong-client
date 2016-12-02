const path = require('path')

const commonConfig = {
  context: path.join(__dirname, '../../src'),

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'},
    ]
  },

  resolve: {
    root: [
      path.join(__dirname, '../../src')
    ],
    extensions: ['', '.js']
  },

  target: 'web'
}


module.exports = commonConfig
