module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],

    files: [
      '*.js'
    ],

    frameworks: ['jasmine'],

    reporters: ['mocha'],

    singleRun: true
  })
}
