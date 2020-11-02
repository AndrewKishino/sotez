"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = exports.generateKeys = exports.checkAddress = exports.generateMnemonic = exports.extractKeys = void 0;
var bip39_1 = require("bip39");
var pbkdf2_1 = __importDefault(require("pbkdf2"));
var libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
var utility_1 = require("./utility");
var constants_1 = require("./constants");
/**
 * @description Extract key pairs from a secret key
 * @param {string} sk The secret key to extract key pairs from
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The extracted key pairs
 * @example
 * cryptoUtils.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
 *   .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
 */
exports.extractKeys = function (sk, password) {
    if (password === void 0) { password = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var curve, encrypted, esb, salt, esm, key, kp, s, kp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
                case 1:
                    _a.sent();
                    curve = sk.substring(0, 2);
                    if (![54, 55, 88, 98].includes(sk.length)) {
                        throw new Error('Invalid length for a key encoding');
                    }
                    encrypted = sk.substring(2, 3) === 'e';
                    if (curve === 'ed') {
                        if (encrypted) {
                            esb = utility_1.b58cdecode(sk, constants_1.prefix.edesk);
                            salt = esb.slice(0, 8);
                            esm = esb.slice(8);
                            if (!password) {
                                throw new Error('No password was provided to decrypt the key');
                            }
                            key = pbkdf2_1.default.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
                            kp = libsodium_wrappers_1.default.crypto_sign_seed_keypair(libsodium_wrappers_1.default.crypto_secretbox_open_easy(new Uint8Array(esm), new Uint8Array(24), new Uint8Array(key)));
                            return [2 /*return*/, {
                                    sk: utility_1.b58cencode(kp.privateKey, constants_1.prefix.edsk),
                                    pk: utility_1.b58cencode(kp.publicKey, constants_1.prefix.edpk),
                                    pkh: utility_1.b58cencode(libsodium_wrappers_1.default.crypto_generichash(20, kp.publicKey), constants_1.prefix.tz1),
                                }];
                        }
                        if (sk.length === 98) {
                            return [2 /*return*/, {
                                    sk: sk,
                                    pk: utility_1.b58cencode(utility_1.b58cdecode(sk, constants_1.prefix.edsk).slice(32), constants_1.prefix.edpk),
                                    pkh: utility_1.b58cencode(libsodium_wrappers_1.default.crypto_generichash(20, utility_1.b58cdecode(sk, constants_1.prefix.edsk).slice(32)), constants_1.prefix.tz1),
                                }];
                        }
                        if (sk.length === 54) {
                            s = utility_1.b58cdecode(sk, constants_1.prefix.edsk2);
                            kp = libsodium_wrappers_1.default.crypto_sign_seed_keypair(s);
                            return [2 /*return*/, {
                                    sk: utility_1.b58cencode(kp.privateKey, constants_1.prefix.edsk),
                                    pk: utility_1.b58cencode(kp.publicKey, constants_1.prefix.edpk),
                                    pkh: utility_1.b58cencode(libsodium_wrappers_1.default.crypto_generichash(20, kp.publicKey), constants_1.prefix.tz1),
                                }];
                        }
                    }
                    console.error('Invalid prefix for a key encoding');
                    return [2 /*return*/, {
                            sk: '',
                            pk: '',
                            pkh: '',
                        }];
            }
        });
    });
};
/**
 * @description Generate a mnemonic
 * @returns {string} The generated mnemonic
 */
exports.generateMnemonic = function () { return bip39_1.generateMnemonic(256); };
/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {string} address The address to check
 * @returns {boolean} Whether address is valid or not
 */
exports.checkAddress = function (address) {
    try {
        utility_1.b58cdecode(address, constants_1.prefix.tz1);
        return true;
    }
    catch (e) {
        return false;
    }
};
/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {string} mnemonic The mnemonic seed
 * @param {string} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 * @example
 * cryptoUtils.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 */
exports.generateKeys = function (mnemonic, passphrase) { return __awaiter(void 0, void 0, void 0, function () {
    var s, kp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
            case 1:
                _a.sent();
                return [4 /*yield*/, bip39_1.mnemonicToSeed(mnemonic, passphrase).then(function (seed) {
                        return seed.slice(0, 32);
                    })];
            case 2:
                s = _a.sent();
                kp = libsodium_wrappers_1.default.crypto_sign_seed_keypair(new Uint8Array(s));
                return [2 /*return*/, {
                        mnemonic: mnemonic,
                        passphrase: passphrase,
                        sk: utility_1.b58cencode(kp.privateKey, constants_1.prefix.edsk),
                        pk: utility_1.b58cencode(kp.publicKey, constants_1.prefix.edpk),
                        pkh: utility_1.b58cencode(libsodium_wrappers_1.default.crypto_generichash(20, kp.publicKey), constants_1.prefix.tz1),
                    }];
        }
    });
}); };
/**
 * @description Sign bytes
 * @param {string} bytes The bytes to sign
 * @param {string} sk The secret key to sign the bytes with
 * @param {Object} magicBytes The magic bytes for the operation
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The signed bytes
 * @example
 * import { magicBytes as magicBytesMap } from 'sotez';
 *
 * cryptoUtils.sign(opbytes, keys.sk, magicBytesMap.generic)
 *   .then(({ bytes, magicBytes, sig, edsig, sbytes }) => console.log(bytes, magicBytes, sig, edsig, sbytes));
 */
exports.sign = function (bytes, sk, magicBytes, password) {
    if (password === void 0) { password = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var e_1, bb, sig, prefixSig, sbytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
                case 1:
                    _a.sent();
                    if (!(sk.length === 54 || sk.length === 55)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, exports.extractKeys(sk, password)];
                case 3:
                    (sk = (_a.sent()).sk);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    throw new Error(e_1);
                case 5:
                    bb = utility_1.hex2buf(bytes);
                    if (typeof magicBytes !== 'undefined') {
                        bb = utility_1.mergebuf(magicBytes, bb);
                    }
                    sig = libsodium_wrappers_1.default.crypto_sign_detached(new Uint8Array(libsodium_wrappers_1.default.crypto_generichash(32, bb)), new Uint8Array(utility_1.b58cdecode(sk, constants_1.prefix.edsk)), 'uint8array');
                    prefixSig = utility_1.b58cencode(sig, constants_1.prefix.edsig);
                    sbytes = bytes + utility_1.buf2hex(sig);
                    return [2 /*return*/, {
                            bytes: bytes,
                            magicBytes: magicBytes ? utility_1.buf2hex(magicBytes) : '',
                            sig: utility_1.b58cencode(sig, constants_1.prefix.sig),
                            prefixSig: prefixSig,
                            sbytes: sbytes,
                        }];
            }
        });
    });
};
/**
 * @description Verify signed bytes
 * @param {string} bytes The signed bytes
 * @param {string} sig The signature of the signed bytes
 * @param {string} pk The public key
 * @returns {boolean} Whether the signed bytes are valid
 */
exports.verify = function (bytes, sig, pk) { return __awaiter(void 0, void 0, void 0, function () {
    var bytesBuffer, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
            case 1:
                _a.sent();
                bytesBuffer = utility_1.hex2buf(bytes);
                signature = utility_1.b58cdecode(sig, constants_1.prefix.sig);
                return [2 /*return*/, libsodium_wrappers_1.default.crypto_sign_verify_detached(signature, libsodium_wrappers_1.default.crypto_generichash(32, bytesBuffer), utility_1.b58cdecode(pk, constants_1.prefix.edpk))];
        }
    });
}); };
exports.default = {
    extractKeys: exports.extractKeys,
    generateKeys: exports.generateKeys,
    checkAddress: exports.checkAddress,
    generateMnemonic: exports.generateMnemonic,
    sign: exports.sign,
    verify: exports.verify,
};
