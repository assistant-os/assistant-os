const path = require('path')
const nodeExternals = require('webpack-node-externals')
const babel = require('./.babelrc')
module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    app: [ path.join(__dirname, 'src/start.js') ],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: babel,
        },
      },
    ],
  },
  externals: [
    nodeExternals({
      whitelist: [ /@assistant-os\/config/, /@assistant-os\/utils/ ],
    }),
  ],
}
