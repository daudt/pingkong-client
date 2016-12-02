const execSync = require('child_process').execSync

console.log('Building bundle with webpack')
execSync('node_modules/.bin/webpack --bail')

execSync('rm -rf dist')

execSync('mkdir dist')
execSync('cp src/index.html dist/')
execSync('cp src/bundle.js dist/')

execSync('mkdir dist/app')
execSync('cp src/app/mountain.json dist/app/')
execSync('cp src/app/king-pong-logo.png dist/app/')
execSync('cp src/app/king-pong-logo-wide.png dist/app/')

console.log('Dist build finished!')
