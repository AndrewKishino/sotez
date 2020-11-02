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
exports.getVersion = exports.signOperation = exports.getAddress = void 0;
var hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
var Tezos_1 = __importDefault(require("./hw-app-xtz/Tezos"));
var constants_1 = require("./constants");
var curves = {
    tz1: 0x00,
    tz2: 0x01,
    tz3: 0x02,
};
/**
 * @description Get the public key and public key hash from the ledger
 * @param {Object} ledgerParams The parameters of the getAddress function
 * @param {Object} ledgerParams.transport The ledger transport to interface with
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {string} [ledgerParams.curve=tz1] The value which defines the curve (tz1=0x00, tz2=0x01, tz3=0x02)
 * @returns {Promise} The public key and public key hash
 * @example
 * ledger.getAddress({
 *   transport: LedgerTransport,
 *   path = "44'/1729'/0'/0'",
 *   displayConfirm = true,
 *   curve = 'tz1',
 * }).then(({ address, publicKey }) => console.log(address, publicKey));
 */
exports.getAddress = function (_a) {
    var _b = _a === void 0 ? { transport: hw_transport_1.default } : _a, transport = _b.transport, _c = _b.path, path = _c === void 0 ? "44'/1729'/0'/0'" : _c, _d = _b.displayConfirm, displayConfirm = _d === void 0 ? true : _d, _e = _b.curve, curve = _e === void 0 ? 'tz1' : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var ledgerTransport, tezosLedger, publicKey, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!transport) {
                        throw new Error('A ledger transport must be provided in the argument parameters');
                    }
                    return [4 /*yield*/, transport.create()];
                case 1:
                    ledgerTransport = _f.sent();
                    tezosLedger = new Tezos_1.default(ledgerTransport);
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, tezosLedger.getAddress(path, displayConfirm, curves[curve])];
                case 3:
                    publicKey = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _f.sent();
                    ledgerTransport.close();
                    return [2 /*return*/, e_1];
                case 5:
                    ledgerTransport.close();
                    return [2 /*return*/, publicKey];
            }
        });
    });
};
/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {Object} ledgerParams.transport The ledger transport to interface with
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {string} [ledgerParams.curve=tz1] The value which defines the curve (tz1=0x00, tz2=0x01, tz3=0x02)
 * @param {Uint8Array} [ledgerParams.magicBytes='03'] The magic bytes for the operation
 * @returns {Promise} The signed operation
 * @example
 * ledger.signOperation({
 *   path = "44'/1729'/0'/0'",
 *   rawTxHex,
 *   curve = 'tz1',
 * }).then((signature) => console.log(signature));
 */
exports.signOperation = function (_a) {
    var transport = _a.transport, _b = _a.path, path = _b === void 0 ? "44'/1729'/0'/0'" : _b, rawTxHex = _a.rawTxHex, _c = _a.curve, curve = _c === void 0 ? 'tz1' : _c, _d = _a.magicBytes, magicBytes = _d === void 0 ? constants_1.magicBytes.generic : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var ledgerTransport, tezosLedger, signature, magicBytesHex, e_2;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!transport) {
                        throw new Error('A ledger transport must be provided in the argument parameters');
                    }
                    return [4 /*yield*/, transport.create()];
                case 1:
                    ledgerTransport = _e.sent();
                    tezosLedger = new Tezos_1.default(ledgerTransport);
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    magicBytesHex = ("00" + magicBytes).slice(-2);
                    return [4 /*yield*/, tezosLedger.signOperation(path, "" + magicBytesHex + rawTxHex, curves[curve])];
                case 3:
                    (signature = (_e.sent()).signature);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _e.sent();
                    ledgerTransport.close();
                    return [2 /*return*/, e_2];
                case 5:
                    ledgerTransport.close();
                    return [2 /*return*/, signature];
            }
        });
    });
};
/**
 * @description Show the version of the ledger
 * @param {LedgerTransport} transport The parameters of the signOperation function
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
exports.getVersion = function (transport) { return __awaiter(void 0, void 0, void 0, function () {
    var ledgerTransport, tezosLedger, versionInfo, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!transport) {
                    throw new Error('A ledger transport must be provided as the argument');
                }
                return [4 /*yield*/, transport.create()];
            case 1:
                ledgerTransport = _a.sent();
                tezosLedger = new Tezos_1.default(ledgerTransport);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, tezosLedger.getVersion()];
            case 3:
                versionInfo = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                ledgerTransport.close();
                return [2 /*return*/, e_3];
            case 5:
                ledgerTransport.close();
                return [2 /*return*/, versionInfo];
        }
    });
}); };
exports.default = {
    getAddress: exports.getAddress,
    signOperation: exports.signOperation,
    getVersion: exports.getVersion,
};
