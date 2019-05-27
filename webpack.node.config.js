const path = require('path');
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [__dirname, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  entry: {
    main: './src/index.ts',
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
