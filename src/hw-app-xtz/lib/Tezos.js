"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /********************************************************************************
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


// FIXME drop:


var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tezos API
 *
 * @example
 * import Tezos from "@ledgerhq/hw-app-xtz";
 * const tez = new Tezos(transport)
 */
var Tezos = function () {
  function Tezos(transport) {
    _classCallCheck(this, Tezos);

    this.transport = transport;
    transport.decorateAppAPIMethods(this, ["getAddress", "signOperation", "getVersion"], "XTZ");
  }

  /**
   * get Tezos public key and address (key hash) for a given BIP 32 path.
   * @param path a path in BIP 32 format, must begin with 44'/1729'
   * @option boolDisplay optionally enable or not the display
   * @option boolChaincode optionally enable or not the chaincode request
   * @option apdu to use a custom apdu. This should currently only be unset (which will choose
             an appropriate APDU based on the boolDisplay parameter), or else set to 0x0A
             for the special "display" APDU which uses the alternate copy "Your Key"
   * @return an object with a publicKey
   * @example
   * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
   */


  _createClass(Tezos, [{
    key: "getAddress",
    value: function getAddress(path, boolDisplay, curve, apdu) {
      if (!apdu) {
        if (boolDisplay) {
          apdu = 0x03;
        } else {
          apdu = 0x02;
        }
      }

      var paths = (0, _utils.splitPath)(path);
      curve = curve ? curve : 0x00; // Defaults to Ed25519
      var buffer = new Buffer(1 + paths.length * 4);
      buffer[0] = paths.length;
      paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 1 + 4 * index);
      });
      return this.transport.send(0x80, apdu, 0, curve, buffer).then(function (response) {
        var publicKeyLength = response[0];
        var publicKey = response.slice(1, 1 + publicKeyLength);
        return (0, _utils.encodePublicKey)(publicKey, curve);
      });
    }
  }, {
    key: "signOperation",
    value: function signOperation(path, rawTxHex, curve) {
      var _this = this;

      var paths = (0, _utils.splitPath)(path);
      var offset = 0;
      var rawTx = new Buffer(rawTxHex, "hex");
      var toSend = [];
      var response = void 0;
      curve = curve ? curve : 0x00;

      // Initial key setting
      {
        var buffer = new Buffer(paths.length * 4 + 1);
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
          buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        toSend.push(buffer);
      }

      while (offset !== rawTx.length) {
        var maxChunkSize = 255;
        var chunkSize = void 0;
        if (offset + maxChunkSize >= rawTx.length) {
          chunkSize = rawTx.length - offset;
        } else {
          chunkSize = maxChunkSize;
        }
        var _buffer = new Buffer(chunkSize);
        rawTx.copy(_buffer, 0, offset, offset + chunkSize);
        toSend.push(_buffer);
        offset += chunkSize;
      }

      return (0, _utils.foreach)(toSend, function (data, i) {
        var code = 0x01;
        if (i === 0) {
          code = 0x00;
        } else if (i === toSend.length - 1) {
          code = 0x81;
        }
        return _this.transport.send(0x80, 0x04, code, curve, data).then(function (apduResponse) {
          response = apduResponse;
        });
      }).then(function () {
        var signature = response.slice(0, response.length - 2).toString("hex");
        return { signature: signature };
      });
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return this.transport.send(0x80, 0x00, 0x00, 0x00, new Buffer(0)).then(function (apduResponse) {
        var bakingApp = apduResponse[0] == 1;
        var major = apduResponse[1];
        var minor = apduResponse[2];
        var patch = apduResponse[3];
        return { major: major, minor: minor, patch: patch, bakingApp: bakingApp };
      });
    }
  }]);

  return Tezos;
}();

exports.default = Tezos;
//# sourceMappingURL=Tezos.js.map