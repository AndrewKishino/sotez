const path = require('path'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'web',
  mode: 'production',
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    alias: {
      ledger$: path.join(__dirname, 'lib', 'ledger-web.js'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
  ],
  entry: path.join(__dirname, 'lib', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'web'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        cache: true,
        parallel: true,
        terserOptions: {
          compress: true,
          ecma: 6,
          mangle: true,
        },
        sourceMap: true,
      }),
    ],
  },
};
