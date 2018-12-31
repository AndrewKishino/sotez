const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin'); // eslint-disable-line
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    modules: [__dirname, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  entry: {
    main: ['@babel/polyfill', './src/sotez.node.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sotez.node.js',
    libraryTarget: 'umd',
  },
};
