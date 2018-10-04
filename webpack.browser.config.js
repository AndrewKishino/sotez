const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line

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
    main: ['babel-polyfill', './src/sotez.browser.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sotez.browser.min.js',
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
        sourceMap: true,
      }),
    ],
  },
};
