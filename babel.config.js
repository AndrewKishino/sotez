module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '6',
          browsers: 'last 2 versions',
        },
      },
    ],
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
    }],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '6',
              browsers: 'last 2 versions',
            },
          },
        ],
        '@babel/preset-flow',
      ],
    },
  },
};
