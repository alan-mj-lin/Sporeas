module.exports = {
  'env': {
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'plugins': [
    'html'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'indent': 'off' /* best practice: 2 spaces instead of tabs */
  },
};
