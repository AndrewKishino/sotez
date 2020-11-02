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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeRawBytes = exports.decodeRawBytes = exports.forge = exports.delegation = exports.origination = exports.transaction = exports.reveal = exports.ballot = exports.proposals = exports.activateAccount = exports.doubleBakingEvidence = exports.doubleEndorsementEvidence = exports.seedNonceRevelation = exports.endorsement = exports.op = exports.publicKey = exports.zarith = exports.address = exports.publicKeyHash = exports.parameters = exports.script = exports.bool = exports.toBytesInt32Hex = exports.toBytesInt32 = void 0;
var bignumber_js_1 = require("bignumber.js");
var utility_1 = require("./utility");
var constants_1 = require("./constants");
/**
 * @description Convert bytes from Int32
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
exports.toBytesInt32 = function (num) {
    // @ts-ignore
    num = parseInt(num, 10);
    var arr = new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        num & 0x000000ff,
    ]);
    return arr.buffer;
};
/**
 * @description Convert hex from Int32
 * @param {number} num Number to convert to hex
 * @returns {string} The converted number
 */
exports.toBytesInt32Hex = function (num) {
    var forgedBuffer = new Uint8Array(exports.toBytesInt32(num));
    return utility_1.buf2hex(forgedBuffer);
};
/**
 * @description Forge boolean
 * @param {boolean} boolArg Boolean value to convert
 * @returns {string} The converted boolean
 */
exports.bool = function (boolArg) { return (boolArg ? 'ff' : '00'); };
/**
 * @description Forge script bytes
 * @param {Object} scriptArg Script to forge
 * @param {string} scriptArg.code Script code
 * @param {string} scriptArg.storage Script storage
 * @returns {string} Forged script bytes
 */
exports.script = function (scriptArg) {
    var t1 = exports.encodeRawBytes(scriptArg.code).toLowerCase();
    var t2 = exports.encodeRawBytes(scriptArg.storage).toLowerCase();
    return (exports.toBytesInt32Hex(t1.length / 2) + t1 + exports.toBytesInt32Hex(t2.length / 2) + t2);
};
/**
 * @description Forge parameter bytes
 * @param {string} parameter Script to forge
 * @param {string} protocol The current block protocol
 * @returns {string} Forged parameter bytes
 */
exports.parameters = function (parameter, protocol) {
    var _a;
    var parameters001 = function (parameterArg) {
        var fp = [];
        fp.push(exports.bool(true));
        var t = exports.encodeRawBytes(parameterArg).toLowerCase();
        fp.push(exports.toBytesInt32Hex(t.length / 2) + t);
        return fp.join('');
    };
    var parameters005 = function (parameterArg) {
        var fp = [];
        var isDefaultParameter = parameterArg.entrypoint === 'default';
        fp.push(isDefaultParameter ? '00' : 'FF');
        if (!isDefaultParameter) {
            var parameterBytes = exports.encodeRawBytes(parameterArg.value).toLowerCase();
            if (constants_1.forgeMappings.entrypointMappingReverse[parameterArg.entrypoint]) {
                fp.push(constants_1.forgeMappings.entrypointMappingReverse[parameterArg.entrypoint]);
            }
            else {
                var stringBytes = exports.encodeRawBytes({
                    string: parameterArg.entrypoint,
                }).toLowerCase();
                fp.push('FF');
                fp.push(stringBytes.slice(8));
            }
            fp.push((parameterBytes.length / 2).toString(16).padStart(8, '0'));
            fp.push(parameterBytes);
        }
        return fp.join('');
    };
    var protocolMap = (_a = {},
        _a["" + constants_1.protocols['001']] = parameters001,
        _a["" + constants_1.protocols['002']] = parameters001,
        _a["" + constants_1.protocols['003']] = parameters001,
        _a["" + constants_1.protocols['004']] = parameters001,
        _a["" + constants_1.protocols['005a']] = parameters005,
        _a["" + constants_1.protocols['005']] = parameters005,
        _a["" + constants_1.protocols['006']] = parameters005,
        _a["" + constants_1.protocols['007a']] = parameters005,
        _a["" + constants_1.protocols['007']] = parameters005,
        _a);
    if (!protocolMap[protocol]) {
        throw new Error("Unrecognized protocol: " + protocol);
    }
    return protocolMap[protocol](parameter);
};
/**
 * @description Forge public key hash bytes
 * @param {string} pkh Public key hash to forge
 * @returns {string} Forged public key hash bytes
 */
exports.publicKeyHash = function (pkh) {
    var t = parseInt(pkh.substr(2, 1), 10);
    var fpkh = ["0" + (t - 1)];
    var forgedBuffer = new Uint8Array(utility_1.b58cdecode(pkh, constants_1.prefix[pkh.substring(0, 3)]));
    fpkh.push(utility_1.buf2hex(forgedBuffer));
    return fpkh.join('');
};
/**
 * @description Forge address bytes
 * @param {string} addressArg Address to forge
 * @param {string} [protocol=''] Current protocol
 * @returns {string} Forged address bytes
 */
exports.address = function (addressArg, protocol) {
    var _a;
    if (protocol === void 0) { protocol = ''; }
    var fa = [];
    var addressSourceBytes = (_a = {},
        _a["" + constants_1.protocols['001']] = true,
        _a["" + constants_1.protocols['002']] = true,
        _a["" + constants_1.protocols['003']] = true,
        _a["" + constants_1.protocols['004']] = true,
        _a);
    var getAddressType = function (a) {
        if (!protocol || addressSourceBytes[protocol]) {
            return a.substring(0, 1) === 'K' ? '01' : '00';
        }
        return '';
    };
    if (addressArg.substring(0, 1) === 'K') {
        fa.push(getAddressType(addressArg));
        var forgedBuffer = new Uint8Array(utility_1.b58cdecode(addressArg, constants_1.prefix.KT));
        fa.push(utility_1.buf2hex(forgedBuffer));
        fa.push('00');
    }
    else {
        fa.push(getAddressType(addressArg));
        fa.push(exports.publicKeyHash(addressArg));
    }
    return fa.join('');
};
/**
 * @description Forge zarith bytes
 * @param {number} n Zarith to forge
 * @returns {string} Forged zarith bytes
 */
exports.zarith = function (n) {
    var fn = [];
    var nn = new bignumber_js_1.BigNumber(n, 10);
    if (nn.isNaN()) {
        throw new TypeError("Error forging zarith " + n);
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (nn.lt(128)) {
            if (nn.lt(16))
                fn.push('0');
            fn.push(nn.toString(16));
            break;
        }
        else {
            var b = nn.mod(128);
            nn = nn.minus(b);
            nn = nn.dividedBy(128);
            b = b.plus(128);
            fn.push(b.toString(16));
        }
    }
    return fn.join('');
};
/**
 * @description Forge public key bytes
 * @param {number} pk Public key to forge
 * @returns {string} Forged public key bytes
 */
exports.publicKey = function (pk) {
    var fpk = [];
    switch (pk.substring(0, 2)) {
        case 'ed':
            fpk.push('00');
            break;
        case 'sp':
            fpk.push('01');
            break;
        case 'p2':
            fpk.push('02');
            break;
        default:
            break;
    }
    var forgedBuffer = new Uint8Array(utility_1.b58cdecode(pk, constants_1.prefix[pk.substring(0, 4)]));
    fpk.push(utility_1.buf2hex(forgedBuffer));
    return fpk.join('');
};
/**
 * @description Forge operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
exports.op = function (opArg, protocol) {
    var _a;
    var opTag001 = function (opKind) {
        return new Uint8Array(new Uint8Array([constants_1.forgeMappings.forgeOpTags['001'][opKind]]));
    };
    var opTag005 = function (opKind) {
        return new Uint8Array(new Uint8Array([constants_1.forgeMappings.forgeOpTags['005'][opKind]]));
    };
    var protocolMap = (_a = {},
        _a["" + constants_1.protocols['001']] = opTag001,
        _a["" + constants_1.protocols['002']] = opTag001,
        _a["" + constants_1.protocols['003']] = opTag001,
        _a["" + constants_1.protocols['004']] = opTag001,
        _a["" + constants_1.protocols['005a']] = opTag005,
        _a["" + constants_1.protocols['005']] = opTag005,
        _a["" + constants_1.protocols['006']] = opTag005,
        _a["" + constants_1.protocols['007a']] = opTag005,
        _a["" + constants_1.protocols['007']] = opTag005,
        _a);
    if (!protocolMap[protocol]) {
        throw new Error("Unrecognized protocol: " + protocol);
    }
    var fop = [];
    var forgedBuffer = protocolMap[protocol](opArg.kind);
    fop.push(utility_1.buf2hex(forgedBuffer));
    if (opArg.kind === 'endorsement') {
        fop.push(exports.endorsement(opArg));
    }
    else if (opArg.kind === 'seed_nonce_revelation') {
        fop.push(exports.seedNonceRevelation(opArg));
    }
    else if (opArg.kind === 'double_endorsement_evidence') {
        fop.push(exports.doubleEndorsementEvidence());
    }
    else if (opArg.kind === 'double_baking_evidence') {
        fop.push(exports.doubleBakingEvidence());
    }
    else if (opArg.kind === 'activate_account') {
        fop.push(exports.activateAccount(opArg));
    }
    else if (opArg.kind === 'proposals') {
        fop.push(exports.proposals());
    }
    else if (opArg.kind === 'ballot') {
        fop.push(exports.ballot(opArg));
    }
    else if (opArg.kind === 'reveal') {
        fop.push(exports.reveal(opArg, protocol));
    }
    else if (opArg.kind === 'transaction') {
        fop.push(exports.transaction(opArg, protocol));
    }
    else if (opArg.kind === 'origination') {
        fop.push(exports.origination(opArg, protocol));
    }
    else if (opArg.kind === 'delegation') {
        fop.push(exports.delegation(opArg, protocol));
    }
    return fop.join('');
};
/**
 * @description Forge endorsement operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
exports.endorsement = function (opArg) {
    var levelBuffer = new Uint8Array(exports.toBytesInt32(opArg.level));
    return utility_1.buf2hex(levelBuffer);
};
/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
exports.seedNonceRevelation = function (opArg) {
    var fop = [];
    var levelBuffer = new Uint8Array(exports.toBytesInt32(opArg.level));
    fop.push(utility_1.buf2hex(levelBuffer));
    fop.push(opArg.nonce);
    return fop.join('');
};
// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge double_endorsement_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
exports.doubleEndorsementEvidence = function () {
    throw new Error('Double endorse forging is not complete');
};
// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge double_baking_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
exports.doubleBakingEvidence = function () {
    throw new Error('Double bake forging is not complete');
};
/**
 * @description Forge activate_account operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
exports.activateAccount = function (opArg) {
    var fop = [];
    var addressBuffer = new Uint8Array(utility_1.b58cdecode(opArg.pkh, constants_1.prefix.tz1));
    fop.push(utility_1.buf2hex(addressBuffer));
    fop.push(opArg.secret);
    return fop.join('');
};
// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge proposals operation bytes
 * @returns {string} Forged operation bytes
 */
exports.proposals = function () {
    throw new Error('Proposal forging is not complete');
};
/**
 * @description Forge ballot operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
exports.ballot = function (opArg) {
    var fop = [];
    fop.push(exports.publicKeyHash(opArg.source));
    var periodBuffer = new Uint8Array(exports.toBytesInt32(opArg.period));
    fop.push(utility_1.buf2hex(periodBuffer));
    var forgedBuffer = new Uint8Array(utility_1.b58cdecode(opArg.proposal, constants_1.prefix.P));
    fop.push(utility_1.buf2hex(forgedBuffer));
    var ballotBytes;
    if (opArg.ballot === 'yay' || opArg.ballot === 'yea') {
        ballotBytes = '00';
    }
    else if (opArg.ballot === 'nay') {
        ballotBytes = '01';
    }
    else {
        ballotBytes = '02';
    }
    fop.push(ballotBytes);
    return fop.join('');
};
/**
 * @description Forge reveal operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
exports.reveal = function (opArg, protocol) {
    var fop = [];
    fop.push(exports.address(opArg.source, protocol));
    fop.push(exports.zarith(opArg.fee));
    fop.push(exports.zarith(opArg.counter));
    fop.push(exports.zarith(opArg.gas_limit));
    fop.push(exports.zarith(opArg.storage_limit));
    fop.push(exports.publicKey(opArg.public_key));
    return fop.join('');
};
/**
 * @description Forge transaction operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
exports.transaction = function (opArg, protocol) {
    var fop = [];
    fop.push(exports.address(opArg.source, protocol));
    fop.push(exports.zarith(opArg.fee));
    fop.push(exports.zarith(opArg.counter));
    fop.push(exports.zarith(opArg.gas_limit));
    fop.push(exports.zarith(opArg.storage_limit));
    fop.push(exports.zarith(opArg.amount));
    fop.push(exports.address(opArg.destination));
    if (opArg.parameters) {
        fop.push(exports.parameters(opArg.parameters, protocol));
    }
    else {
        fop.push(exports.bool(false));
    }
    return fop.join('');
};
/**
 * @description Forge origination operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
exports.origination = function (opArg, protocol) {
    var _a;
    var origination001 = function (o, forgedOp) {
        forgedOp.push(exports.publicKeyHash(o.manager_pubkey));
        forgedOp.push(exports.zarith(o.balance));
        forgedOp.push(exports.bool(o.spendable));
        forgedOp.push(exports.bool(o.delegatable));
        if (o.delegate) {
            forgedOp.push(exports.bool(true));
            forgedOp.push(exports.publicKeyHash(o.delegate));
        }
        else {
            forgedOp.push(exports.bool(false));
        }
        if (o.script) {
            forgedOp.push(exports.bool(true));
            forgedOp.push(exports.script(o.script));
        }
        else {
            forgedOp.push(exports.bool(false));
        }
        return forgedOp.join('');
    };
    var origination005 = function (o, forgedOp) {
        forgedOp.push(exports.zarith(o.balance));
        if (o.delegate) {
            forgedOp.push(exports.bool(true));
            forgedOp.push(exports.publicKeyHash(o.delegate));
        }
        else {
            forgedOp.push(exports.bool(false));
        }
        forgedOp.push(exports.script(o.script));
        return forgedOp.join('');
    };
    var protocolMap = (_a = {},
        _a["" + constants_1.protocols['001']] = origination001,
        _a["" + constants_1.protocols['002']] = origination001,
        _a["" + constants_1.protocols['003']] = origination001,
        _a["" + constants_1.protocols['004']] = origination001,
        _a["" + constants_1.protocols['005a']] = origination005,
        _a["" + constants_1.protocols['005']] = origination005,
        _a["" + constants_1.protocols['006']] = origination005,
        _a["" + constants_1.protocols['007a']] = origination005,
        _a["" + constants_1.protocols['007']] = origination005,
        _a);
    var fop = [];
    fop.push(exports.address(opArg.source, protocol));
    fop.push(exports.zarith(opArg.fee));
    fop.push(exports.zarith(opArg.counter));
    fop.push(exports.zarith(opArg.gas_limit));
    fop.push(exports.zarith(opArg.storage_limit));
    return protocolMap[protocol](opArg, fop);
};
/**
 * @description Forge delegation operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
exports.delegation = function (opArg, protocol) {
    var fop = [];
    fop.push(exports.address(opArg.source, protocol));
    fop.push(exports.zarith(opArg.fee));
    fop.push(exports.zarith(opArg.counter));
    fop.push(exports.zarith(opArg.gas_limit));
    fop.push(exports.zarith(opArg.storage_limit));
    if (opArg.delegate) {
        fop.push(exports.bool(true));
        fop.push(exports.publicKeyHash(opArg.delegate));
    }
    else {
        fop.push(exports.bool(false));
    }
    return fop.join('');
};
/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {number} counter The current counter for the account
 * @param {string} protocol The current block protocol
 * @returns {string} Forged operation bytes
 * @example
 * forge.forge({
 *   branch: head.hash,
 *   contents: [{
 *     kind: 'transaction',
 *     source: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
 *     fee: '50000',
 *     counter: '31204',
 *     gas_limit: '10200',
 *     storage_limit: '0',
 *     amount: '100000000',
 *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   }],
 * }, 32847).then(({ opbytes, opOb }) => console.log(opbytes, opOb));
 */
exports.forge = function (opOb, counter, protocol) { return __awaiter(void 0, void 0, void 0, function () {
    var forgedBuffer, forgedBytes;
    return __generator(this, function (_a) {
        if (!opOb.contents) {
            throw new Error('No operation contents provided.');
        }
        if (!opOb.branch) {
            throw new Error('No operation branch provided.');
        }
        forgedBuffer = new Uint8Array(utility_1.b58cdecode(opOb.branch, constants_1.prefix.b));
        forgedBytes = [utility_1.buf2hex(forgedBuffer)];
        opOb.contents.forEach(function (content) {
            forgedBytes.push(exports.op(content, protocol));
        });
        return [2 /*return*/, {
                opbytes: forgedBytes.join(''),
                opOb: opOb,
                counter: counter,
            }];
    });
}); };
/**
 * @description Decode raw bytes
 * @param {string} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
exports.decodeRawBytes = function (bytes) {
    bytes = bytes.toUpperCase();
    var index = 0;
    var read = function (len) {
        var readBytes = bytes.slice(index, index + len);
        index += len;
        return readBytes;
    };
    var rec = function () {
        var b = read(2);
        var prim = constants_1.forgeMappings.primMapping[b];
        if (prim instanceof Object) {
            var forgeOp = constants_1.forgeMappings.opMapping[read(2)];
            var args = __spreadArrays(Array(prim.len));
            var result = {
                prim: forgeOp,
                args: args.map(function () { return rec(); }),
                annots: undefined,
            };
            if (!prim.len) {
                delete result.args;
            }
            if (prim.annots) {
                var annotsLen = parseInt(read(8), 16) * 2;
                var stringHexLst = read(annotsLen).match(/[\dA-F]{2}/g);
                if (stringHexLst) {
                    var stringBytes = new Uint8Array(stringHexLst.map(function (x) { return parseInt(x, 16); }));
                    var stringResult = utility_1.textDecode(stringBytes);
                    result.annots = stringResult.split(' ');
                }
            }
            else {
                delete result.annots;
            }
            return result;
        }
        if (b === '0A') {
            var len = read(8);
            var intLen = parseInt(len, 16) * 2;
            var data = read(intLen);
            return { bytes: data };
        }
        if (b === '01') {
            var len = read(8);
            var intLen = parseInt(len, 16) * 2;
            var data = read(intLen);
            var matchResult = data.match(/[\dA-F]{2}/g);
            if (matchResult instanceof Array) {
                var stringRaw = new Uint8Array(matchResult.map(function (x) { return parseInt(x, 16); }));
                return { string: utility_1.textDecode(stringRaw) };
            }
            throw new Error('Input bytes error');
        }
        if (b === '00') {
            var firstBytes = parseInt(read(2), 16).toString(2).padStart(8, '0');
            // const isPositive = firstBytes[1] === '0';
            var validBytes = [firstBytes.slice(2)];
            var checknext = firstBytes[0] === '1';
            while (checknext) {
                var bytesCheck = parseInt(read(2), 16).toString(2).padStart(8, '0');
                validBytes.push(bytesCheck.slice(1));
                checknext = bytesCheck[0] === '1';
            }
            var num = new bignumber_js_1.BigNumber(validBytes.reverse().join(''), 2);
            return { int: num.toString() };
        }
        if (b === '02') {
            var len = read(8);
            var intLen = parseInt(len, 16) * 2;
            // const data = read(intLen);
            var limit = index + intLen;
            var seqLst = [];
            while (limit > index) {
                seqLst.push(rec());
            }
            return seqLst;
        }
        throw new Error("Invalid raw bytes: Byte:" + b + " Index:" + index);
    };
    return rec();
};
/**
 * @description Encode raw bytes
 * @param {Object} input The value to encode
 * @returns {string} Encoded value as bytes
 */
exports.encodeRawBytes = function (input) {
    var rec = function (inputArg) {
        var result = [];
        if (inputArg instanceof Array) {
            result.push('02');
            var bytes = inputArg.map(function (x) { return rec(x); }).join('');
            var len = bytes.length / 2;
            result.push(len.toString(16).padStart(8, '0'));
            result.push(bytes);
        }
        else if (inputArg instanceof Object) {
            if ('prim' in inputArg) {
                var argsLen = inputArg.args ? inputArg.args.length : 0;
                result.push(constants_1.forgeMappings.primMappingReverse[argsLen]["" + !!inputArg.annots]);
                result.push(constants_1.forgeMappings.opMappingReverse[inputArg.prim]);
                if (inputArg.args) {
                    inputArg.args.forEach(function (arg) { return result.push(rec(arg)); });
                }
                if (inputArg.annots) {
                    var annotsBytes = inputArg.annots
                        .map(function (x) {
                        var forgedBuffer = new Uint8Array(utility_1.textEncode(x));
                        return utility_1.buf2hex(forgedBuffer);
                    })
                        .join('20');
                    result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
                    result.push(annotsBytes);
                }
            }
            else if ('bytes' in inputArg) {
                var len = inputArg.bytes.length / 2;
                result.push('0A');
                result.push(len.toString(16).padStart(8, '0'));
                result.push(inputArg.bytes);
            }
            else if ('int' in inputArg) {
                var num = new bignumber_js_1.BigNumber(inputArg.int, 10);
                var positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
                var binary = num.toString(2).replace('-', '');
                var pad = 
                // eslint-disable-next-line no-nested-ternary
                binary.length <= 6
                    ? 6
                    : (binary.length - 6) % 7
                        ? binary.length + 7 - ((binary.length - 6) % 7)
                        : binary.length;
                var splitted = binary.padStart(pad, '0').match(/\d{6,7}/g) || [];
                var reversed_1 = splitted.reverse();
                reversed_1[0] = positiveMark + reversed_1[0];
                var numHex = reversed_1
                    .map(function (x, i) {
                    return parseInt((i === reversed_1.length - 1 ? '0' : '1') + x, 2)
                        .toString(16)
                        .padStart(2, '0');
                })
                    .join('');
                result.push('00');
                result.push(numHex);
            }
            else if ('string' in inputArg) {
                var stringBytes = utility_1.textEncode(inputArg.string);
                var stringHex = [].slice
                    .call(stringBytes)
                    .map(function (x) { return x.toString(16).padStart(2, '0'); })
                    .join('');
                var len = stringBytes.length;
                result.push('01');
                result.push(len.toString(16).padStart(8, '0'));
                result.push(stringHex);
            }
        }
        return result.join('');
    };
    return rec(input).toUpperCase();
};
exports.default = {
    address: exports.address,
    decodeRawBytes: exports.decodeRawBytes,
    encodeRawBytes: exports.encodeRawBytes,
    forge: exports.forge,
    op: exports.op,
    endorsement: exports.endorsement,
    seedNonceRevelation: exports.seedNonceRevelation,
    doubleEndorsementEvidence: exports.doubleEndorsementEvidence,
    doubleBakingEvidence: exports.doubleBakingEvidence,
    activateAccount: exports.activateAccount,
    proposals: exports.proposals,
    ballot: exports.ballot,
    reveal: exports.reveal,
    transaction: exports.transaction,
    origination: exports.origination,
    delegation: exports.delegation,
    parameters: exports.parameters,
    publicKey: exports.publicKey,
    publicKeyHash: exports.publicKeyHash,
    zarith: exports.zarith,
    bool: exports.bool,
    script: exports.script,
    toBytesInt32: exports.toBytesInt32,
    toBytesInt32Hex: exports.toBytesInt32Hex,
};
