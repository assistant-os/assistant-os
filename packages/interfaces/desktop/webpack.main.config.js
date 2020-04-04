const path = require('path')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    alias: {
      '@assistant-os/service-projects': path.resolve(
        __dirname,
        '../../services/projects'
      ),
    },
  },
  externals: {
    winston: 'winston',
  },
  // externals: ['@assistant-os/service-projects'],
}
