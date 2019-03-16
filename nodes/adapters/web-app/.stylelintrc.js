module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-empty-line-before': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['global'],
      },
    ],
  },
}
