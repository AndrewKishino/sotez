const path = require('path');
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line

module.exports = {
  target: 'node',
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
    filename: 'sotez.node.min.js',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
  mode: 'production',
};
