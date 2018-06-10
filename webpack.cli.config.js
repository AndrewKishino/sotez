const path = require('path');

module.exports = {
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
    main: ['babel-polyfill', './src/cli.sotez.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sotez.cli.js',
  },
  mode: 'production',
  target: 'node',
};
