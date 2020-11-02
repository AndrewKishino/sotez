"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePublicKey = exports.splitPath = void 0;
var bs58check_1 = __importDefault(require("bs58check"));
var blake2b_1 = __importDefault(require("blake2b"));
/**
 * @description Split path utility
 * @param {string} path The ledger path
 * @returns {number[]} Array of path segments
 */
function splitPath(path) {
    var result = [];
    var components = path.split('/');
    components.forEach(function (element) {
        var number = parseInt(element, 10);
        if (Number.isNaN(number)) {
            return;
        }
        if (element.length > 1 && element[element.length - 1] === "'") {
            number += 0x80000000;
        }
        result.push(number);
    });
    return result;
}
exports.splitPath = splitPath;
var pkB58Prefix = function (curve) {
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
        default:
            return Buffer.of(0);
    }
};
var pkhB58Prefix = function (curve) {
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
        default:
            return Buffer.of(0);
    }
};
// converts uncompressed ledger key to standard tezos binary
// representation, with curve marker first byte (as for michelson key
// type)
var compressPublicKey = function (publicKey, curve) {
    switch (curve) {
        // Ed25519
        case 0x00:
            publicKey = publicKey.slice(0);
            publicKey[0] = curve;
            return publicKey;
        // SECP256K1, SECP256R1
        case 0x01:
        case 0x02:
            return Buffer.concat([
                Buffer.of(curve, 0x02 + (publicKey[64] & 0x01)),
                publicKey.slice(1, 33),
            ]);
        default:
            return Buffer.of(0);
    }
};
exports.encodePublicKey = function (publicKey, curve) {
    publicKey = compressPublicKey(publicKey, curve);
    return {
        publicKey: publicKeyToString(publicKey),
        address: hashPublicKeyToString(publicKey),
    };
};
var publicKeyToString = function (publicKey) {
    var curve = publicKey[0];
    var key = publicKey.slice(1);
    return bs58check_1.default.encode(Buffer.concat([pkB58Prefix(curve), key]));
};
var keyHashSize = 20;
var hashPublicKeyToString = function (publicKey) {
    var curve = publicKey[0];
    var key = publicKey.slice(1);
    var hash = blake2b_1.default(keyHashSize);
    hash.update(key);
    hash.digest((hash = Buffer.alloc(keyHashSize)));
    return bs58check_1.default.encode(Buffer.concat([pkhB58Prefix(curve), hash]));
};
