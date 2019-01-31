const isNode = require('detect-node');

module.exports = isNode ? require('./dist/sotez.node') : require('./dist/sotez.browser.min');
