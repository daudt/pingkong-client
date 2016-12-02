const webpackConfig = require('./webpack.unit.conf.js')

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],

    files: [
      '**/*.js'
    ],

    preprocessors: {
      '../unit/**/*.js': ['webpack']
    },

    webpack: webpackConfig,

    frameworks: ['jasmine'],

    reporters: ['mocha'],

    singleRun: true
  })
}
