const path = require('path');
// const nodeExternals = require('webpack-node-externals');
module.exports = {
  node: {
    __dirname: true
  },
  mode: 'production',
  target: 'node',
  entry: {
    app: [path.join(__dirname, 'scripts/start-all.js')]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/
      }
    ]
  }
};
