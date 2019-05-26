const isNode = require('detect-node');

if (isNode) {
  global.__non_webpack_require__ = require;
}

module.exports = isNode
  ? __non_webpack_require__('./dist/node') // eslint-disable-line
  : require('./dist/web');
