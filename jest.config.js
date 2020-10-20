const path = require('path')

module.exports = {
  testPathIgnorePatterns: ['/web-app/'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': [
      'babel-jest',
      { configFile: path.join(__dirname, './.babelrc.js') },
    ],
  },
}
