var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BigNumber } from 'bignumber.js';
import toBuffer from 'typedarray-to-buffer';
import utility from './utility';
import { prefix, forgeMappings, protocols } from './constants';
;
;
;
/**
 * @description Convert bytes from Int32
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
const toBytesInt32 = (num) => {
    // @ts-ignore
    num = parseInt(num, 10);
    const arr = new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        (num & 0x000000ff),
    ]);
    return arr.buffer;
};
/**
 * @description Convert hex from Int32
 * @param {number} num Number to convert to hex
 * @returns {string} The converted number
 */
const toBytesInt32Hex = (num) => {
    const forgedBuffer = toBuffer(toBytesInt32(num));
    return utility.buf2hex(forgedBuffer);
};
/**
 * @description Forge boolean
 * @param {boolean} bool Boolean value to convert
 * @returns {string} The converted boolean
 */
const bool = (bool) => (bool ? 'ff' : '00');
/**
 * @description Forge script bytes
 * @param {Object} script Script to forge
 * @param {string} script.code Script code
 * @param {string} script.storage Script storage
 * @returns {string} Forged script bytes
 */
const script = (script) => {
    const t1 = encodeRawBytes(script.code).toLowerCase();
    const t2 = encodeRawBytes(script.storage).toLowerCase();
    return toBytesInt32Hex(t1.length / 2) + t1 + toBytesInt32Hex(t2.length / 2) + t2;
};
/**
 * @description Forge parameter bytes
 * @param {string} parameter Script to forge
 * @returns {string} Forged parameter bytes
 */
const parameters = (parameter, protocol) => {
    let fp = [];
    if (protocol === protocols['005']) {
        const isDefaultParameter = parameter.entrypoint === 'default';
        fp.push(isDefaultParameter ? '00' : 'FF');
        if (!isDefaultParameter) {
            const parameterBytes = encodeRawBytes(parameter.value).toLowerCase();
            if (forgeMappings.entrypointMappingReverse[parameter.entrypoint]) {
                fp.push(forgeMappings.entrypointMappingReverse[parameter.entrypoint]);
            }
            else {
                const stringBytes = encodeRawBytes({ string: parameter.entrypoint }).toLowerCase();
                fp.push('FF');
                fp.push(stringBytes.slice(8));
            }
            fp.push((parameterBytes.length / 2).toString(16).padStart(8, '0'));
            fp.push(parameterBytes);
        }
    }
    else {
        fp.push(bool(true));
        const t = encodeRawBytes(parameter).toLowerCase();
        fp.push(toBytesInt32Hex(t.length / 2) + t);
    }
    return fp.join('');
};
/**
 * @description Forge public key hash bytes
 * @param {string} pkh Public key hash to forge
 * @returns {string} Forged public key hash bytes
 */
const publicKeyHash = (pkh) => {
    const t = parseInt(pkh.substr(2, 1), 10);
    let fpkh = [`0${t - 1}`];
    const forgedBuffer = toBuffer(utility.b58cdecode(pkh, prefix[pkh.substr(0, 3)]));
    fpkh.push(utility.buf2hex(forgedBuffer));
    return fpkh.join('');
};
/**
 * @description Forge address bytes
 * @param {string} address Address to forge
 * @returns {string} Forged address bytes
 */
const address = (address, protocol) => {
    let fa = [];
    if (address.substr(0, 1) === 'K') {
        fa.push(protocol === protocols['005'] ? '' : '01');
        const forgedBuffer = toBuffer(utility.b58cdecode(address, prefix.KT));
        fa.push(utility.buf2hex(forgedBuffer));
        fa.push('00');
    }
    else {
        fa.push(protocol === protocols['005'] ? '' : '00');
        fa.push(publicKeyHash(address));
    }
    return fa.join('');
};
/**
 * @description Forge zarith bytes
 * @param {number} n Zarith to forge
 * @returns {string} Forged zarith bytes
 */
const zarith = (n) => {
    let fn = [];
    let nn = parseInt(n, 10);
    if (Number.isNaN(nn)) {
        throw new TypeError(`Error forging zarith ${n}`);
    }
    while (true) { // eslint-disable-line
        if (nn < 128) {
            if (nn < 16)
                fn.push('0');
            fn.push(nn.toString(16));
            break;
        }
        else {
            let b = (nn % 128);
            nn -= b;
            nn /= 128;
            b += 128;
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
const publicKey = (pk) => {
    let fpk = [];
    switch (pk.substr(0, 2)) {
        case 'ed':
            fpk.push('00');
            break;
        case 'sp':
            fpk.push('01');
            break;
        case 'p2':
            fpk.push('02');
            break;
        default: break;
    }
    const forgedBuffer = toBuffer(utility.b58cdecode(pk, prefix[pk.substr(0, 4)]));
    fpk.push(utility.buf2hex(forgedBuffer));
    return fpk.join('');
};
/**
 * @description Forge operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const op = (op, protocol) => {
    let fop = [];
    let forgedBuffer;
    if (protocol === protocols['005']) {
        forgedBuffer = toBuffer(new Uint8Array([forgeMappings.forgeOpTags['005'][op.kind]]));
    }
    else {
        forgedBuffer = toBuffer(new Uint8Array([forgeMappings.forgeOpTags['004'][op.kind]]));
    }
    fop.push(utility.buf2hex(forgedBuffer));
    if (op.kind === 'endorsement') {
        fop.push(endorsement(op));
    }
    else if (op.kind === 'seed_nonce_revelation') {
        fop.push(seedNonceRevelation(op));
    }
    else if (op.kind === 'double_endorsement_evidence') {
        fop.push(doubleEndorsementEvidence(op));
    }
    else if (op.kind === 'double_baking_evidence') {
        fop.push(doubleBakingEvidence(op));
    }
    else if (op.kind === 'activate_account') {
        fop.push(activateAccount(op));
    }
    else if (op.kind === 'proposals') {
        fop.push(proposals(op));
    }
    else if (op.kind === 'ballot') {
        fop.push(ballot(op));
    }
    else if (op.kind === 'reveal') {
        fop.push(reveal(op, protocol));
    }
    else if (op.kind === 'transaction') {
        fop.push(transaction(op, protocol));
    }
    else if (op.kind === 'origination') {
        fop.push(origination(op, protocol));
    }
    else if (op.kind === 'delegation') {
        fop.push(delegation(op, protocol));
    }
    return fop.join('');
};
/**
 * @description Forge endorsement operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 */
const endorsement = (op) => {
    const levelBuffer = toBuffer(toBytesInt32(op.level));
    return utility.buf2hex(levelBuffer);
};
/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
const seedNonceRevelation = (op) => {
    let fop = [];
    const levelBuffer = toBuffer(toBytesInt32(op.level));
    fop.push(utility.buf2hex(levelBuffer));
    fop.push(op.nonce);
    return fop.join('');
};
/**
 * @description Forge double_endorsement_evidence operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
const doubleEndorsementEvidence = (op) => {
    throw new Error('Double endorse forging is not complete');
};
/**
 * @description Forge double_baking_evidence operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const doubleBakingEvidence = (op) => {
    throw new Error('Double bake forging is not complete');
};
/**
 * @description Forge activate_account operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
const activateAccount = (op) => {
    let fop = [];
    const addressBuffer = toBuffer(utility.b58cdecode(op.pkh, prefix.tz1));
    fop.push(utility.buf2hex(addressBuffer));
    fop.push(op.secret);
    return fop.join('');
};
/**
 * @description Forge proposals operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
const proposals = (op) => {
    throw new Error('Proposal forging is not complete');
};
/**
 * @description Forge ballot operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
const ballot = (op) => {
    let fop = [];
    fop.push(publicKeyHash(op.source));
    const periodBuffer = toBuffer(toBytesInt32(op.period));
    fop.push(utility.buf2hex(periodBuffer));
    const forgedBuffer = toBuffer(utility.b58cdecode(op.proposal, prefix.P));
    fop.push(utility.buf2hex(forgedBuffer));
    let ballot;
    if (op.ballot === 'yay' || op.ballot === 'yea') {
        ballot = '00';
    }
    else if (op.ballot === 'nay') {
        ballot = '01';
    }
    else {
        ballot = '02';
    }
    fop.push(ballot);
    return fop.join('');
};
/**
 * @description Forge reveal operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const reveal = (op, protocol) => {
    let fop = [];
    fop.push(address(op.source, protocol));
    fop.push(zarith(op.fee));
    fop.push(zarith(op.counter));
    fop.push(zarith(op.gas_limit));
    fop.push(zarith(op.storage_limit));
    fop.push(publicKey(op.public_key));
    return fop.join('');
};
/**
 * @description Forge transaction operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const transaction = (op, protocol) => {
    let fop = [];
    fop.push(address(op.source, protocol));
    fop.push(zarith(op.fee));
    fop.push(zarith(op.counter));
    fop.push(zarith(op.gas_limit));
    fop.push(zarith(op.storage_limit));
    fop.push(zarith(op.amount));
    fop.push(address(op.destination));
    if (op.parameters) {
        fop.push(parameters(op.parameters, protocol));
    }
    else {
        fop.push(bool(false));
    }
    return fop.join('');
};
/**
 * @description Forge origination operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const origination = (op, protocol) => {
    let fop = [];
    fop.push(address(op.source, protocol));
    fop.push(zarith(op.fee));
    fop.push(zarith(op.counter));
    fop.push(zarith(op.gas_limit));
    fop.push(zarith(op.storage_limit));
    if (protocol === protocols['005']) {
        fop.push(zarith(op.balance));
        if (op.delegate) {
            fop.push(bool(true));
            fop.push(publicKeyHash(op.delegate));
        }
        else {
            fop.push(bool(false));
        }
        fop.push(script(op.script));
    }
    else {
        fop.push(publicKeyHash(op.manager_pubkey));
        fop.push(zarith(op.balance));
        fop.push(bool(op.spendable));
        fop.push(bool(op.delegatable));
        if (op.delegate) {
            fop.push(bool(true));
            fop.push(publicKeyHash(op.delegate));
        }
        else {
            fop.push(bool(false));
        }
        if (op.script) {
            fop.push(bool(true));
            fop.push(script(op.script));
        }
        else {
            fop.push(bool(false));
        }
    }
    return fop.join('');
};
/**
 * @description Forge delegation operation bytes
 * @param {Object} op Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
const delegation = (op, protocol) => {
    let fop = [];
    fop.push(address(op.source, protocol));
    fop.push(zarith(op.fee));
    fop.push(zarith(op.counter));
    fop.push(zarith(op.gas_limit));
    fop.push(zarith(op.storage_limit));
    if (op.delegate) {
        fop.push(bool(true));
        fop.push(publicKeyHash(op.delegate));
    }
    else {
        fop.push(bool(false));
    }
    return fop.join('');
};
/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {number} counter The current counter for the account
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
const forge = (opOb, counter, protocol) => __awaiter(void 0, void 0, void 0, function* () {
    if (!opOb.contents) {
        throw new Error('No operation contents provided.');
    }
    if (!opOb.branch) {
        throw new Error('No operation branch provided.');
    }
    const forgedBuffer = toBuffer(utility.b58cdecode(opOb.branch, prefix.b));
    let forgedBytes = [utility.buf2hex(forgedBuffer)];
    opOb.contents.forEach((content) => {
        forgedBytes.push(op(content, protocol));
    });
    return {
        opbytes: forgedBytes.join(''),
        opOb,
        counter,
    };
});
/**
 * @description Decode raw bytes
 * @param {string} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
const decodeRawBytes = (bytes) => {
    bytes = bytes.toUpperCase();
    let index = 0;
    const read = (len) => {
        const readBytes = bytes.slice(index, index + len);
        index += len;
        return readBytes;
    };
    const rec = () => {
        const b = read(2);
        const prim = forgeMappings.primMapping[b];
        if (prim instanceof Object) {
            const op = forgeMappings.opMapping[read(2)];
            const args = [...Array(prim.len)];
            const result = {
                prim: op,
                args: args.map(() => rec()),
                annots: undefined,
            };
            if (!prim.len) {
                delete result.args;
            }
            if (prim.annots) {
                const annotsLen = parseInt(read(8), 16) * 2;
                const stringHexLst = read(annotsLen).match(/[\dA-F]{2}/g);
                if (stringHexLst) {
                    const stringBytes = new Uint8Array(stringHexLst.map(x => parseInt(x, 16)));
                    const stringResult = utility.textDecode(stringBytes);
                    result.annots = stringResult.split(' ');
                }
            }
            else {
                delete result.annots;
            }
            return result;
        }
        if (b === '0A') {
            const len = read(8);
            const intLen = parseInt(len, 16) * 2;
            const data = read(intLen);
            return { bytes: data };
        }
        if (b === '01') {
            const len = read(8);
            const intLen = parseInt(len, 16) * 2;
            const data = read(intLen);
            const matchResult = data.match(/[\dA-F]{2}/g);
            if (matchResult instanceof Array) {
                const stringRaw = new Uint8Array(matchResult.map(x => parseInt(x, 16)));
                return { string: utility.textDecode(stringRaw) };
            }
            throw new Error('Input bytes error');
        }
        if (b === '00') {
            const firstBytes = parseInt(read(2), 16).toString(2).padStart(8, '0');
            // const isPositive = firstBytes[1] === '0';
            const validBytes = [firstBytes.slice(2)];
            let checknext = firstBytes[0] === '1';
            while (checknext) {
                const bytesCheck = parseInt(read(2), 16).toString(2).padStart(8, '0');
                validBytes.push(bytesCheck.slice(1));
                checknext = bytesCheck[0] === '1';
            }
            const num = new BigNumber(validBytes.reverse().join(''), 2);
            return { int: num.toString() };
        }
        if (b === '02') {
            const len = read(8);
            const intLen = parseInt(len, 16) * 2;
            // const data = read(intLen);
            const limit = index + intLen;
            const seqLst = [];
            while (limit > index) {
                seqLst.push(rec());
            }
            return seqLst;
        }
        throw new Error(`Invalid raw bytes: Byte:${b} Index:${index}`);
    };
    return rec();
};
/**
 * @description Encode raw bytes
 * @param {Object} input The value to encode
 * @returns {string} Encoded value as bytes
 */
const encodeRawBytes = (input) => {
    const rec = (inputArg) => {
        const result = [];
        if (inputArg instanceof Array) {
            result.push('02');
            const bytes = inputArg.map(x => rec(x)).join('');
            const len = bytes.length / 2;
            result.push(len.toString(16).padStart(8, '0'));
            result.push(bytes);
        }
        else if (inputArg instanceof Object) {
            if ('prim' in inputArg) {
                const argsLen = inputArg.args ? inputArg.args.length : 0;
                result.push(forgeMappings.primMappingReverse[argsLen][`${!!inputArg.annots}`]);
                result.push(forgeMappings.opMappingReverse[inputArg.prim]);
                if (inputArg.args) {
                    inputArg.args.forEach((arg) => result.push(rec(arg)));
                }
                if (inputArg.annots) {
                    const annotsBytes = inputArg.annots.map((x) => {
                        const forgedBuffer = toBuffer(utility.textEncode(x));
                        return utility.buf2hex(forgedBuffer);
                    }).join('20');
                    result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
                    result.push(annotsBytes);
                }
            }
            else if ('bytes' in inputArg) {
                const len = inputArg.bytes.length / 2;
                result.push('0A');
                result.push(len.toString(16).padStart(8, '0'));
                result.push(inputArg.bytes);
            }
            else if ('int' in inputArg) {
                const num = new BigNumber(inputArg.int, 10);
                const positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
                const binary = num.toString(2).replace('-', '');
                const pad = binary.length <= 6
                    ? 6
                    : (binary.length - 6) % 7
                        ? binary.length + 7 - (binary.length - 6) % 7
                        : binary.length;
                const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
                const reversed = splitted.reverse();
                reversed[0] = positiveMark + reversed[0];
                const numHex = reversed.map((x, i) => parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
                    .toString(16)
                    .padStart(2, '0')).join('');
                result.push('00');
                result.push(numHex);
            }
            else if ('string' in inputArg) {
                const stringBytes = utility.textEncode(inputArg.string);
                const stringHex = [].slice.call(stringBytes).map((x) => x.toString(16).padStart(2, '0')).join('');
                const len = stringBytes.length;
                result.push('01');
                result.push(len.toString(16).padStart(8, '0'));
                result.push(stringHex);
            }
        }
        return result.join('');
    };
    return rec(input).toUpperCase();
};
export default {
    address,
    decodeRawBytes,
    encodeRawBytes,
    forge,
    op,
    endorsement,
    seedNonceRevelation,
    doubleEndorsementEvidence,
    doubleBakingEvidence,
    activateAccount,
    proposals,
    ballot,
    reveal,
    transaction,
    origination,
    delegation,
    parameters,
    publicKey,
    publicKeyHash,
    zarith,
    bool,
    script,
    toBytesInt32,
    toBytesInt32Hex,
};
