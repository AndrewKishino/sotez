const isBrowser = () => typeof window !== 'undefined';

module.exports = isBrowser()
  ? require('./src/sotez.browser')
  : require('./src/sotez.node');
