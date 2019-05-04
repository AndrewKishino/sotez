const isNode = require('detect-node');

module.exports = isNode
  ? require('./dist/node/tez.node')
  : require('./dist/browser/tez.browser');
