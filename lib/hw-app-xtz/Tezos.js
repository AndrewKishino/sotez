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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var TezosCurves = {
    ED25519: 0x00,
    SECP256K1: 0x01,
    SECP256R1: 0x02,
};
/**
 * Tezos API
 *
 * @example
 * import Tezos from '@ledgerhq/hw-app-xtz';
 * const tez = new Tezos(transport)
 */
var Tezos = /** @class */ (function () {
    function Tezos(transport) {
        this.transport = transport;
        transport.decorateAppAPIMethods(this, ['getAddress', 'signOperation', 'getVersion'], 'XTZ');
    }
    /**
     * @description Get Tezos address for a given BIP 32 path.
     * @param {string} path a path in BIP 32 format, must begin with 44'/1729'
     * @param {boolean} [boolDisplay=false] optionally enable or not the display
     * @param {number} [curve=0x00] optionally enable or not the chaincode request
     * @param {number} [apdu] to use a custom apdu. This should currently only be unset (which will choose
     *   an appropriate APDU based on the boolDisplay parameter), or else set to 0x0A
     *   for the special "display" APDU which uses the alternate copy "Your Key"
     * @returns {Promise} An object with a publicKey
     * @example
     * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
     */
    Tezos.prototype.getAddress = function (path, boolDisplay, curve, apdu) {
        if (boolDisplay === void 0) { boolDisplay = false; }
        if (curve === void 0) { curve = TezosCurves.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var cla, p1, p2, paths, buffer, payload, publicKeyLength, publicKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cla = 0x80;
                        if (!apdu) {
                            if (boolDisplay) {
                                apdu = 0x03;
                            }
                            else {
                                apdu = 0x02;
                            }
                        }
                        p1 = 0;
                        p2 = curve;
                        paths = utils_1.splitPath(path);
                        buffer = Buffer.alloc(1 + paths.length * 4);
                        buffer[0] = paths.length;
                        paths.forEach(function (element, index) {
                            buffer.writeUInt32BE(element, 1 + 4 * index);
                        });
                        return [4 /*yield*/, this.transport.send(cla, apdu, p1, p2, buffer)];
                    case 1:
                        payload = _a.sent();
                        publicKeyLength = payload[0];
                        publicKey = payload.slice(1, 1 + publicKeyLength);
                        return [2 /*return*/, utils_1.encodePublicKey(publicKey, curve)];
                }
            });
        });
    };
    Tezos.prototype.sign = function (path, rawTxHex, curve, adpu) {
        if (curve === void 0) { curve = TezosCurves.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var paths, offset, rawTx, toSend, buffer, maxChunkSize, chunkSize, buff, response, i, data, code, signature, signatureBuffer, r_val, s_val, idx, frameType, r_length, s_length;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = utils_1.splitPath(path);
                        offset = 0;
                        rawTx = Buffer.from(rawTxHex, 'hex');
                        toSend = [];
                        buffer = Buffer.alloc(paths.length * 4 + 1);
                        buffer[0] = paths.length;
                        paths.forEach(function (element, index) {
                            buffer.writeUInt32BE(element, 1 + 4 * index);
                        });
                        toSend.push(buffer);
                        while (offset !== rawTx.length) {
                            maxChunkSize = 230;
                            chunkSize = void 0;
                            if (offset + maxChunkSize >= rawTx.length) {
                                chunkSize = rawTx.length - offset;
                            }
                            else {
                                chunkSize = maxChunkSize;
                            }
                            buff = Buffer.alloc(chunkSize);
                            rawTx.copy(buff, 0, offset, offset + chunkSize);
                            toSend.push(buff);
                            offset += chunkSize;
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < toSend.length)) return [3 /*break*/, 4];
                        data = toSend[i];
                        code = 0x01;
                        if (i === 0) {
                            code = 0x00;
                        }
                        else if (i === toSend.length - 1) {
                            code = 0x81;
                        }
                        return [4 /*yield*/, this.transport.send(0x80, adpu, code, curve, data)];
                    case 2:
                        // eslint-disable-next-line no-await-in-loop
                        response = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (curve === TezosCurves.ED25519) {
                            signature = response.slice(0, response.length - 2).toString('hex');
                        }
                        else {
                            signatureBuffer = Buffer.alloc(64);
                            signatureBuffer.fill(0);
                            r_val = signatureBuffer.subarray(0, 32);
                            s_val = signatureBuffer.subarray(32, 64);
                            idx = 0;
                            frameType = response.readUInt8(idx++);
                            if (frameType !== 0x31 && frameType !== 0x30) {
                                throw new Error('Cannot parse ledger response.');
                            }
                            if (response.readUInt8(idx++) + 4 !== response.length) {
                                throw new Error('Cannot parse ledger response.');
                            }
                            if (response.readUInt8(idx++) !== 0x02) {
                                throw new Error('Cannot parse ledger response.');
                            }
                            r_length = response.readUInt8(idx++);
                            if (r_length > 32) {
                                idx += r_length - 32;
                                r_length = 32;
                            }
                            response.copy(r_val, 32 - r_length, idx, idx + r_length);
                            idx += r_length;
                            if (response.readUInt8(idx++) !== 0x02) {
                                throw new Error('Cannot parse ledger response.');
                            }
                            s_length = response.readUInt8(idx++);
                            if (s_length > 32) {
                                idx += s_length - 32;
                                s_length = 32;
                            }
                            response.copy(s_val, 32 - s_length, idx, idx + s_length);
                            idx += s_length;
                            if (idx !== response.length - 2) {
                                throw new Error('Cannot parse ledger response.');
                            }
                            signature = signatureBuffer.toString('hex');
                        }
                        return [2 /*return*/, { signature: signature }];
                }
            });
        });
    };
    Tezos.prototype.signOperation = function (path, rawTxHex, curve) {
        if (curve === void 0) { curve = TezosCurves.ED25519; }
        return this.sign(path, rawTxHex, curve, 0x04);
    };
    Tezos.prototype.signHash = function (path, rawTxHex, curve) {
        if (curve === void 0) { curve = TezosCurves.ED25519; }
        return this.sign(path, rawTxHex, curve, 0x05);
    };
    Tezos.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, appFlag, major, minor, patch, bakingApp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.transport.send(0x80, 0x00, 0x00, 0x00, Buffer.alloc(0))];
                    case 1:
                        _a = _b.sent(), appFlag = _a[0], major = _a[1], minor = _a[2], patch = _a[3];
                        bakingApp = appFlag === 1;
                        return [2 /*return*/, { major: major, minor: minor, patch: patch, bakingApp: bakingApp }];
                }
            });
        });
    };
    return Tezos;
}());
exports.default = Tezos;
