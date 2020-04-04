const rules = require('./webpack.rules')
const path = require('path')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    {
      loader: 'css-loader',
      options: {
        modules: {
          mode: 'local',
          localIdentName: '[local]--[hash:base64:5]',
        },
      },
    },
    // Compiles Sass to CSS
    'sass-loader',
  ],
})

rules.push({
  test: /\.svg$/,
  loader: 'svg-inline-loader',
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src/renderer'),
    },
    modules: ['node_modules', './src'],
    extensions: ['.jsx', '.js', '.json', '.scss', '.svg'],
  },
}
