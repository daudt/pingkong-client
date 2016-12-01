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
    'brace-style': [
      2,
      'stroustrup'
    ],
    'curly': 2,
    'comma-dangle': 0,
    'max-len': 0,
    'quotes': [
      2,
      'single',
      {
        'allowTemplateLiterals': true,
        'avoidEscape': true
      }
    ],
    'react/prop-types': 0,
    'require-jsdoc': 0,
    'semi': 0
  }
}
