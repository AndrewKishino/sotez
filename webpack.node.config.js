const path = require('path');
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
    main: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist', 'node'),
    filename: 'tez.node.js',
    libraryTarget: 'umd',
  },
};
