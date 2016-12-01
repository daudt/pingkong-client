module.exports = {
  'env': {
    'es6': true,
    'browser': true,
    'node': true
  },

  'extends': [
    'google',
    'plugin:react/recommended'
  ],

  'installedESLint': true,

  'parser': 'babel-eslint',

  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    },
    'sourceType': 'module'
  },

  'plugins': [
    'react'
  ],

  'rules': {
    'comma-dangle': 'off',
    'react/prop-types': 'off',
    'require-jsdoc': 'off',
    'semi': 'off'
  }
}
