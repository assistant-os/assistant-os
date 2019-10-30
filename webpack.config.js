const path = require('path')
const nodeExternals = require('webpack-node-externals')

const babel = require('./.babelrc')

// https://medium.com/@Georgian/webpack-4-config-for-lerna-monorepo-using-babel-7-and-jest-8342c4ebc239
module.exports = {
  node: {
    __dirname: true,
  },
  mode: 'production',
  target: 'node',
  entry: {
    app: ['@babel/polyfill', path.join(__dirname, 'scripts/start-all.js')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
      whitelist: [/^@assistant-os.*/],
    }),
  ],
}
