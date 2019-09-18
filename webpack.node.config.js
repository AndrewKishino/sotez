const path = require('path'); // eslint-disable-line
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    modules: [__dirname, 'node_modules'],
    alias: {
      ledger$: path.join(__dirname, 'build', 'ledger.js'),
    },
  },
  entry: {
    main: ['regenerator-runtime/runtime', path.join(__dirname, 'build', 'index.js')],
  },
  output: {
    path: path.join(__dirname, 'dist', 'node'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
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
