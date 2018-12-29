'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodePublicKey = undefined;
exports.defer = defer;
exports.splitPath = splitPath;
exports.eachSeries = eachSeries;
exports.foreach = foreach;
exports.doIf = doIf;
exports.asyncWhile = asyncWhile;

var _bs58check = require('bs58check');

var _bs58check2 = _interopRequireDefault(_bs58check);

var _blake2b = require('blake2b');

var _blake2b2 = _interopRequireDefault(_blake2b);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
function defer() {
  var resolve = void 0,
      reject = void 0;
  var promise = new Promise(function (success, failure) {
    resolve = success;
    reject = failure;
  });
  if (!resolve || !reject) throw "defer() error"; // this never happens and is just to make flow happy
  return { promise: promise, resolve: resolve, reject: reject };
}

// TODO use bip32-path library
function splitPath(path) {
  var result = [];
  var components = path.split("/");
  components.forEach(function (element) {
    var number = parseInt(element, 10);
    if (isNaN(number)) {
      return; // FIXME shouldn't it throws instead?
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}

// TODO use async await

function eachSeries(arr, fun) {
  return arr.reduce(function (p, e) {
    return p.then(function () {
      return fun(e);
    });
  }, Promise.resolve());
}

function foreach(arr, callback) {
  function iterate(index, array, result) {
    if (index >= array.length) {
      return result;
    } else return callback(array[index], index).then(function (res) {
      result.push(res);
      return iterate(index + 1, array, result);
    });
  }
  return Promise.resolve().then(function () {
    return iterate(0, arr, []);
  });
}

function doIf(condition, callback) {
  return Promise.resolve().then(function () {
    if (condition) {
      return callback();
    }
  });
}

function asyncWhile(predicate, callback) {
  function iterate(result) {
    if (!predicate()) {
      return result;
    } else {
      return callback().then(function (res) {
        result.push(res);
        return iterate(result);
      });
    }
  }
  return Promise.resolve([]).then(iterate);
}

var pkB58Prefix = function pkB58Prefix(curve) {
  switch (curve) {
    // edpk
    case 0x00:
      return Buffer.of(13, 15, 37, 217);
    // sppk
    case 0x01:
      return Buffer.of(3, 254, 226, 86);
    // p2pk
    case 0x02:
      return Buffer.of(3, 178, 139, 127);
  }
};

var pkhB58Prefix = function pkhB58Prefix(curve) {
  switch (curve) {
    // tz1
    case 0x00:
      return Buffer.of(6, 161, 159);
    // tz2
    case 0x01:
      return Buffer.of(6, 161, 161);
    // tz3
    case 0x02:
      return Buffer.of(6, 161, 164);
  }
};

// converts uncompressed ledger key to standard tezos binary
// representation, with curve marker first byte (as for michelson key
// type)
var compressPublicKey = function compressPublicKey(publicKey, curve) {
  switch (curve) {
    // Ed25519
    case 0x00:
      publicKey = publicKey.slice(0);
      publicKey[0] = curve;
      return publicKey;
    // SECP256K1, SECP256R1
    case 0x01:
    case 0x02:
      return Buffer.concat([Buffer.of(curve, 0x02 + (publicKey[64] & 0x01)), publicKey.slice(1, 33)]);
  }
};

var encodePublicKey = exports.encodePublicKey = function encodePublicKey(publicKey, curve) {
  publicKey = compressPublicKey(publicKey, curve);
  return {
    publicKey: publicKeyToString(publicKey),
    address: hashPublicKeyToString(publicKey)
  };
};

// remaining functions operate on tezos compressed key w/ curve marker

var publicKeyToString = function publicKeyToString(publicKey) {
  var curve = publicKey[0];
  var key = publicKey.slice(1);
  return _bs58check2.default.encode(Buffer.concat([pkB58Prefix(curve), key]));
};

var keyHashSize = 20;

var hashPublicKeyToString = function hashPublicKeyToString(publicKey) {
  var curve = publicKey[0];
  var key = publicKey.slice(1);
  var hash = (0, _blake2b2.default)(keyHashSize);
  hash.update(key);
  hash.digest(hash = new Buffer(keyHashSize));
  return _bs58check2.default.encode(Buffer.concat([pkhB58Prefix(curve), hash]));
};
//# sourceMappingURL=utils.js.map