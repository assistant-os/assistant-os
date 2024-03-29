module.exports = {
  parser: 'babel-eslint',
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unpublished-require': 'off',
  },
}
