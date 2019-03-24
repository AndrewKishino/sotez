const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
  },
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
    path: path.join(__dirname, 'dist'),
    filename: 'tez.node.js',
    libraryTarget: 'umd',
  },
};
