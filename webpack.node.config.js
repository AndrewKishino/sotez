const path = require('path'); // eslint-disable-line
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    alias: {
      ledger$: path.join(__dirname, 'lib', 'ledger.js'),
    },
  },
  entry: path.join(__dirname, 'lib', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'node'),
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
