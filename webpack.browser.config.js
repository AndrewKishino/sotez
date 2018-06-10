const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    main: ['babel-polyfill', './src/browser.sotez.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sotez.min.js',
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true,
        },
        sourceMap: false,
      }),
    ],
  },
  target: 'web',
};
