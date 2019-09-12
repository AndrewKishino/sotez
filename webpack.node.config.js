const path = require('path'); // eslint-disable-line
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line
const TypedocWebpackPlugin = require('typedoc-webpack-plugin'); // eslint-disable-line

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [__dirname, 'node_modules'],
    alias: {
      ledger$: path.resolve(__dirname, './src/ledger.ts'),
    },
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
    path: path.join(__dirname, 'build', 'node'),
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
  plugins: [
    new TypedocWebpackPlugin({
      name: 'Sotez Documentation',
      out: '../../docs',
      tsconfig: '../../tsconfig.json',
      ignoreCompilerErrors: true,
      mode: 'modules',
      theme: 'markdown',
      readme: 'none',
      exclude: [
        'src/index.ts',
        'src/ledger-web.ts',
        'src/hw-app-xtz/*',
        '**/node_modules/**/*.*',
      ],
    }),
  ],
};
