module.exports = {
  target: 'node',
  entry: {
    app: [ './back.js' ],
  },
  rules: [
    {
      test: /\.?js$/,
      use: {
        loader: 'babel-loader',
      },
    },
  ],
}
