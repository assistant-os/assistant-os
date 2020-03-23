module.exports = {
  extends: ['react-app', 'prettier'],
  rules: {
    'no-const-assign': 'error',
    eqeqeq: 'error',
    strict: 'error',
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'eslint-config-hapi': 0,
    'no-const-assign': 'error',
    'no-unused-vars': [2, { vars: 'all', args: 'none' }],
    'comma-spacing': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    // 'import/no-unresolved': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
}
