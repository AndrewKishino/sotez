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
exports.Key = void 0;
var libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
var pbkdf2_1 = __importDefault(require("pbkdf2"));
var elliptic_1 = __importDefault(require("elliptic"));
var ledger_1 = require("./ledger");
var utility_1 = require("./utility");
var constants_1 = require("./constants");
/**
 * Creates a key object from a base58 encoded key.
 *
 * @class Key
 * @param {Object} KeyConstructor
 * @param {string} [KeyConstructor.key] A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string. Not
 *   providing a key will import a ledger public key.
 * @param {string} [KeyConstructor.passphrase] The passphrase used if the key provided is an encrypted private key or a fundraiser key
 * @param {string} [KeyConstructor.email] Email used if a fundraiser key is passed
 * @param {string} [KeyConstructor.ledgerPath="44'/1729'/0'/0'"] Ledger derivation path
 * @param {string} [KeyConstructor.ledgerCurve=tz1] Ledger curve
 * @example
 * const key = new Key({ key: 'edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y' });
 * await key.ready;
 *
 * const key = new Key({ ledgerPath: "44'/1729'/0'/1'" });
 * await key.ready;
 */
var Key = /** @class */ (function () {
    function Key(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, key = _b.key, passphrase = _b.passphrase, email = _b.email, _c = _b.ledgerPath, ledgerPath = _c === void 0 ? "44'/1729'/0'/0'" : _c, _d = _b.ledgerCurve, ledgerCurve = _d === void 0 ? 'tz1' : _d, ledgerTransport = _b.ledgerTransport;
        /**
         * @memberof Key
         * @description Returns the public key
         * @returns {string} The public key associated with the private key
         */
        this.publicKey = function () {
            return utility_1.b58cencode(_this._publicKey, constants_1.prefix[_this._curve + "pk"]);
        };
        /**
         * @memberof Key
         * @description Returns the secret key
         * @returns {string} The secret key associated with this key, if available
         */
        this.secretKey = function () {
            if (!_this._secretKey) {
                throw new Error('Secret key not known.');
            }
            var key = _this._secretKey;
            if (_this._curve === 'ed') {
                var privateKey = libsodium_wrappers_1.default.crypto_sign_seed_keypair(key.slice(0, 32)).privateKey;
                key = privateKey;
            }
            return utility_1.b58cencode(key, constants_1.prefix[_this._curve + "sk"]);
        };
        /**
         * @memberof Key
         * @description Returns public key hash for this key
         * @returns {string} The public key hash for this key
         */
        this.publicKeyHash = function () {
            var prefixMap = {
                ed: constants_1.prefix.tz1,
                sp: constants_1.prefix.tz2,
                p2: constants_1.prefix.tz3,
            };
            var _prefix = prefixMap[_this._curve];
            return utility_1.b58cencode(libsodium_wrappers_1.default.crypto_generichash(20, new Uint8Array(_this._publicKey)), _prefix);
        };
        this.initialize = function (_a, ready) {
            var key = _a.key, passphrase = _a.passphrase, email = _a.email;
            return __awaiter(_this, void 0, void 0, function () {
                var salt, seed, _b, publicKey, privateKey, encrypted, publicOrSecret, constructedKey, salt, encryptedSk, encryptionKey, _c, publicKey, privateKey, keyPair, prefixVal, pad, keyPair, prefixVal, pad;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, libsodium_wrappers_1.default.ready];
                        case 1:
                            _d.sent();
                            if (!(this._isLedger || !key)) return [3 /*break*/, 3];
                            return [4 /*yield*/, ledger_1.getAddress({
                                    transport: this._ledgerTransport,
                                    path: this._ledgerPath,
                                    displayConfirm: true,
                                    curve: this._ledgerCurve,
                                })];
                        case 2:
                            (key = (_d.sent()).publicKey);
                            _d.label = 3;
                        case 3:
                            if (email) {
                                if (!passphrase) {
                                    throw new Error('Fundraiser key provided without a passphrase.');
                                }
                                salt = utility_1.textDecode(utility_1.textEncode("" + email + passphrase)).normalize('NFKD');
                                seed = pbkdf2_1.default.pbkdf2Sync(key, "mnemonic" + salt, 2048, 64, 'sha512');
                                _b = libsodium_wrappers_1.default.crypto_sign_seed_keypair(new Uint8Array(seed.slice(0, 32))), publicKey = _b.publicKey, privateKey = _b.privateKey;
                                this._publicKey = new Uint8Array(publicKey);
                                this._secretKey = new Uint8Array(privateKey);
                                this._curve = 'ed';
                                this._isSecret = true;
                                ready();
                                return [2 /*return*/];
                            }
                            this._curve = key.substring(0, 2);
                            if (!['sp', 'p2', 'ed'].includes(this._curve)) {
                                throw new Error('Invalid prefix for a key encoding.');
                            }
                            if (![54, 55, 88, 98].includes(key.length)) {
                                throw new Error('Invalid length for a key encoding');
                            }
                            encrypted = key.substring(2, 3) === 'e';
                            publicOrSecret = encrypted
                                ? key.substring(3, 5)
                                : key.substring(2, 4);
                            if (!['pk', 'sk'].includes(publicOrSecret)) {
                                throw new Error('Invalid prefix for a key encoding.');
                            }
                            this._isSecret = publicOrSecret === 'sk';
                            if (this._isSecret) {
                                constructedKey = utility_1.b58cdecode(key, constants_1.prefix["" + this._curve + (encrypted ? 'e' : '') + "sk"]);
                            }
                            else {
                                constructedKey = utility_1.b58cdecode(key, constants_1.prefix[this._curve + "pk"]);
                            }
                            if (encrypted) {
                                if (!passphrase) {
                                    throw new Error('Encrypted key provided without a passphrase.');
                                }
                                salt = constructedKey.slice(0, 8);
                                encryptedSk = constructedKey.slice(8);
                                encryptionKey = pbkdf2_1.default.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');
                                constructedKey = libsodium_wrappers_1.default.crypto_secretbox_open_easy(new Uint8Array(encryptedSk), new Uint8Array(24), new Uint8Array(encryptionKey));
                            }
                            if (!this._isSecret) {
                                this._publicKey = new Uint8Array(constructedKey);
                                this._secretKey = undefined;
                            }
                            else {
                                this._secretKey = new Uint8Array(constructedKey);
                                if (this._curve === 'ed') {
                                    if (constructedKey.length === 64) {
                                        this._publicKey = new Uint8Array(constructedKey.slice(32));
                                    }
                                    else {
                                        _c = libsodium_wrappers_1.default.crypto_sign_seed_keypair(new Uint8Array(constructedKey), 'uint8array'), publicKey = _c.publicKey, privateKey = _c.privateKey;
                                        this._publicKey = new Uint8Array(publicKey);
                                        this._secretKey = new Uint8Array(privateKey);
                                    }
                                }
                                else if (this._curve === 'sp') {
                                    keyPair = new elliptic_1.default.ec('secp256k1').keyFromPrivate(constructedKey);
                                    prefixVal = keyPair.getPublic().getY().toArray()[31] % 2 ? 3 : 2;
                                    pad = new Array(32).fill(0);
                                    this._publicKey = new Uint8Array([prefixVal].concat(pad.concat(keyPair.getPublic().getX().toArray()).slice(-32)));
                                }
                                else if (this._curve === 'p2') {
                                    keyPair = new elliptic_1.default.ec('p256').keyFromPrivate(constructedKey);
                                    prefixVal = keyPair.getPublic().getY().toArray()[31] % 2 ? 3 : 2;
                                    pad = new Array(32).fill(0);
                                    this._publicKey = new Uint8Array([prefixVal].concat(pad.concat(keyPair.getPublic().getX().toArray()).slice(-32)));
                                }
                                else {
                                    throw new Error('Invalid key');
                                }
                            }
                            ready();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @memberof Key
         * @description Sign a raw sequence of bytes
         * @param {string} bytes Sequence of bytes, raw format or hexadecimal notation
         * @param {Uint8Array} magicBytes The magic bytes for the operation
         * @returns {Promise} The signature object
         */
        this.sign = function (bytes, magicBytes) { return __awaiter(_this, void 0, void 0, function () {
            var signature, signatureBuffer, sbytes, bb, bytesHash, signature, sbytes, key, sig, signature, sbytes, key, sig, signature, sbytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._isLedger) return [3 /*break*/, 2];
                        return [4 /*yield*/, ledger_1.signOperation({
                                transport: this._ledgerTransport,
                                path: this._ledgerPath,
                                rawTxHex: bytes,
                                curve: this._ledgerCurve,
                                magicBytes: magicBytes,
                            })];
                    case 1:
                        signature = _a.sent();
                        signatureBuffer = utility_1.hex2buf(signature);
                        sbytes = bytes + signature;
                        return [2 /*return*/, {
                                bytes: bytes,
                                magicBytes: magicBytes ? utility_1.buf2hex(magicBytes) : '',
                                sig: utility_1.b58cencode(signatureBuffer, constants_1.prefix.sig),
                                prefixSig: utility_1.b58cencode(signatureBuffer, constants_1.prefix[this._curve + "sig"]),
                                sbytes: sbytes,
                            }];
                    case 2:
                        bb = utility_1.hex2buf(bytes);
                        if (typeof magicBytes !== 'undefined') {
                            bb = utility_1.mergebuf(magicBytes, bb);
                        }
                        bytesHash = new Uint8Array(libsodium_wrappers_1.default.crypto_generichash(32, bb));
                        if (!this._secretKey) {
                            throw new Error('Cannot sign operations without a secret key.');
                        }
                        if (this._curve === 'ed') {
                            signature = libsodium_wrappers_1.default.crypto_sign_detached(bytesHash, this._secretKey);
                            sbytes = bytes + utility_1.buf2hex(signature);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    magicBytes: magicBytes ? utility_1.buf2hex(magicBytes) : '',
                                    sig: utility_1.b58cencode(signature, constants_1.prefix.sig),
                                    prefixSig: utility_1.b58cencode(signature, constants_1.prefix.edsig),
                                    sbytes: sbytes,
                                }];
                        }
                        if (this._curve === 'sp') {
                            key = new elliptic_1.default.ec('secp256k1').keyFromPrivate(this._secretKey);
                            sig = key.sign(bytesHash, { canonical: true });
                            signature = new Uint8Array(sig.r.toArray(undefined, 32).concat(sig.s.toArray(undefined, 32)));
                            sbytes = bytes + utility_1.buf2hex(signature);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    magicBytes: magicBytes ? utility_1.buf2hex(magicBytes) : '',
                                    sig: utility_1.b58cencode(signature, constants_1.prefix.sig),
                                    prefixSig: utility_1.b58cencode(signature, constants_1.prefix.spsig),
                                    sbytes: sbytes,
                                }];
                        }
                        if (this._curve === 'p2') {
                            key = new elliptic_1.default.ec('p256').keyFromPrivate(this._secretKey);
                            sig = key.sign(bytesHash, { canonical: true });
                            signature = new Uint8Array(sig.r.toArray(undefined, 32).concat(sig.s.toArray(undefined, 32)));
                            sbytes = bytes + utility_1.buf2hex(signature);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    magicBytes: magicBytes ? utility_1.buf2hex(magicBytes) : '',
                                    sig: utility_1.b58cencode(signature, constants_1.prefix.sig),
                                    prefixSig: utility_1.b58cencode(signature, constants_1.prefix.p2sig),
                                    sbytes: sbytes,
                                }];
                        }
                        throw new Error('Provided curve not supported');
                }
            });
        }); };
        /**
         * @memberof Key
         * @description Verify signature
         * @param {string} bytes Sequance of bytes, raw format or hexadecimal notation
         * @param {string} signature A signature in base58 encoding
         * @param {string} publicKey A public key
         * @returns {boolean} Whether the signature is valid
         */
        this.verify = function (bytes, signature, publicKey) {
            if (publicKey === void 0) { publicKey = _this.publicKey(); }
            if (!publicKey) {
                throw new Error('Cannot verify without a public key');
            }
            var _curve = publicKey.substring(0, 2);
            var _publicKey = new Uint8Array(utility_1.b58cdecode(publicKey, constants_1.prefix[_curve + "pk"]));
            if (signature.substring(0, 3) !== 'sig') {
                if (_curve !== signature.substring(0, 2)) {
                    // 'sp', 'p2' 'ed'
                    throw new Error('Signature and public key curves mismatch.');
                }
            }
            var bytesBuffer = libsodium_wrappers_1.default.crypto_generichash(32, utility_1.hex2buf(bytes));
            var sig;
            if (signature.substring(0, 3) === 'sig') {
                sig = utility_1.b58cdecode(signature, constants_1.prefix.sig);
            }
            else if (signature.substring(0, 5) === _curve + "sig") {
                sig = utility_1.b58cdecode(signature, constants_1.prefix[_curve + "sig"]);
            }
            else {
                throw new Error("Invalid signature provided: " + signature);
            }
            if (_curve === 'ed') {
                try {
                    return libsodium_wrappers_1.default.crypto_sign_verify_detached(new Uint8Array(sig), new Uint8Array(bytesBuffer), _publicKey);
                }
                catch (e) {
                    return false;
                }
            }
            else if (_curve === 'sp') {
                var key = new elliptic_1.default.ec('secp256k1').keyFromPublic(_publicKey);
                var formattedSig = utility_1.buf2hex(sig);
                var match = formattedSig.match(/([a-f\d]{64})/gi);
                if (match) {
                    try {
                        var r = match[0], s = match[1];
                        return key.verify(bytesBuffer, { r: r, s: s });
                    }
                    catch (e) {
                        return false;
                    }
                }
                return false;
            }
            else if (_curve === 'p2') {
                var key = new elliptic_1.default.ec('p256').keyFromPublic(_publicKey);
                var formattedSig = utility_1.buf2hex(sig);
                var match = formattedSig.match(/([a-f\d]{64})/gi);
                if (match) {
                    try {
                        var r = match[0], s = match[1];
                        return key.verify(bytesBuffer, { r: r, s: s });
                    }
                    catch (e) {
                        return false;
                    }
                }
                return false;
            }
            else {
                throw new Error("Curve '" + _curve + "' not supported");
            }
        };
        this._isLedger = !key;
        this._ledgerPath = ledgerPath;
        this._ledgerCurve = ledgerCurve;
        this._ledgerTransport = ledgerTransport;
        this.ready = new Promise(function (resolve) {
            _this.initialize({ key: key, passphrase: passphrase, email: email }, resolve);
        });
    }
    Object.defineProperty(Key.prototype, "curve", {
        get: function () {
            return this._curve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Key.prototype, "isLedger", {
        get: function () {
            return this._isLedger;
        },
        set: function (value) {
            this._isLedger = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Key.prototype, "ledgerPath", {
        get: function () {
            return this._ledgerPath;
        },
        set: function (value) {
            this._ledgerPath = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Key.prototype, "ledgerCurve", {
        get: function () {
            return this._ledgerCurve;
        },
        set: function (value) {
            this._ledgerCurve = value;
        },
        enumerable: false,
        configurable: true
    });
    return Key;
}());
exports.Key = Key;
