const isNode = require('detect-node');

module.exports = isNode
  ? require('./dist/tez.node')
  : require('./dist/tez.browser');
