const execSync = require('child_process').execSync

console.log('Building bundle with webpack')
execSync('node_modules/.bin/webpack --bail --optimize-minimize --optimize-occurrence-order --optimize-dedupe')

execSync('rm -rf dist')

execSync('mkdir dist')
execSync('cp src/index.html dist/')
execSync('mv src/bundle.js dist/')

// Add cache-busting query param, but do some file juggling due to
// inconsistencies in sed's in-place editing in OSX vs *nix:
execSync("sed -e 's/bundle\\.js/bundle.js?r="+Math.random().toString(36)+"/g' dist/index.html > dist/index2.html")
execSync('rm dist/index.html')
execSync('mv dist/index2.html dist/index.html')

execSync('mkdir dist/app')
execSync('cp src/app/checkmark.svg dist/app/')
execSync('cp src/app/king-pong-logo.png dist/app/')
execSync('cp src/app/king-pong-logo-wide.png dist/app/')

console.log('Dist build finished!')
