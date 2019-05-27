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
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist', 'node'),
    filename: 'index.js',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: true,
          mangle: true,
        },
        sourceMap: true,
      }),
    ],
  },
};
