module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', 'prettier'],
  plugins: ['prettier'],
};
