const isNode = require('detect-node');

if (isNode) {
  // eslint-disable-next-line @typescript-eslint/camelcase
  global.__non_webpack_require__ = require;
}

module.exports = isNode
  ? __non_webpack_require__('./build/node')  // eslint-disable-line
  : require('./build/web');
