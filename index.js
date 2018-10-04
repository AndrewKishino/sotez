const isBrowser = () => typeof window !== 'undefined';
const isNode = () => !isBrowser && typeof process !== 'undefined';

module.exports = isNode()
  ? require('./dist/sotez.node.min')
  : require('./dist/sotez.browser.min');
