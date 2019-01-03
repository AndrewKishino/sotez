const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'web',
  mode: 'production',
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
    main: ['@babel/polyfill', './src/sotez.browser.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sotez.browser.min.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new UnminifiedWebpackPlugin(),
  ],
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
