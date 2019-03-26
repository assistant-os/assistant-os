const rules = require('./rules')

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: rules,
}
