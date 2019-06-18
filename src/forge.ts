import { BigNumber } from 'bignumber.js';
import utility from './utility';
import { prefix, forgeMappings } from './constants';

import {
  Forge,
  ConstructedOperation,
  OperationObject,
  ForgedBytes,
} from './types';

// @ts-ignore
const forge: Forge = {};
/**
 * @description Convert bytes from Int32
 * @param {Number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
forge.toBytesInt32 = (num: number): any => {
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
 * @param {Number} num Number to convert to hex
 * @returns {String} The converted number
 */
forge.toBytesInt32Hex = (num: number): string => utility.buf2hex(forge.toBytesInt32(num));

/**
 * @description Forge boolean
 * @param {Boolean} bool Boolean value to convert
 * @returns {String} The converted boolean
 */
forge.bool = (bool: boolean): string => (bool ? 'ff' : '00');

/**
 * @description Forge script bytes
 * @param {Object} script Script to forge
 * @param {String} script.code Script code
 * @param {String} script.storage Script storage
 * @returns {String} Forged script bytes
 */
forge.script = (script: { code: string; storage: string }): string => {
  const t1 = forge.encodeRawBytes(script.code).toLowerCase();
  const t2 = forge.encodeRawBytes(script.storage).toLowerCase();
  return forge.toBytesInt32Hex(t1.length / 2) + t1 + forge.toBytesInt32Hex(t2.length / 2) + t2;
};

/**
 * @description Forge parameter bytes
 * @param {String} parameter Script to forge
 * @returns {String} Forged parameter bytes
 */
forge.parameters = (parameter: string): string => {
  const t = forge.encodeRawBytes(parameter).toLowerCase();
  return forge.toBytesInt32Hex(t.length / 2) + t;
};

/**
 * @description Forge public key hash bytes
 * @param {String} pkh Public key hash to forge
 * @returns {String} Forged public key hash bytes
 */
forge.publicKeyHash = (pkh: string): string => {
  const t = parseInt(pkh.substr(2, 1), 10);
  let fpkh = `0${t - 1}`;
  fpkh += utility.buf2hex(utility.b58cdecode(pkh, prefix[pkh.substr(0, 3)]));
  return fpkh;
};

/**
 * @description Forge address bytes
 * @param {String} address Address to forge
 * @returns {String} Forged address bytes
 */
forge.address = (address: string): string => {
  let fa;
  if (address.substr(0, 1) === 'K') {
    fa = '01';
    fa += utility.buf2hex(utility.b58cdecode(address, prefix.KT));
    fa += '00';
  } else {
    fa = '00';
    fa += forge.publicKeyHash(address);
  }
  return fa;
};

/**
 * @description Forge zarith bytes
 * @param {Number} n Zarith to forge
 * @returns {String} Forged zarith bytes
 */
forge.zarith = (n: string): string => {
  let fn = '';
  let nn = parseInt(n, 10);
  if (Number.isNaN(nn)) {
    throw new TypeError(`Error forging zarith ${n}`);
  }
  while (true) { // eslint-disable-line
    if (nn < 128) {
      if (nn < 16) fn += '0';
      fn += nn.toString(16);
      break;
    } else {
      let b = (nn % 128);
      nn -= b;
      nn /= 128;
      b += 128;
      fn += b.toString(16);
    }
  }
  return fn;
};

/**
 * @description Forge public key bytes
 * @param {Number} pk Public key to forge
 * @returns {String} Forged public key bytes
 */
forge.publicKey = (pk: string): string => {
  let fpk = '';
  switch (pk.substr(0, 2)) {
    case 'ed': fpk = '00'; break;
    case 'sp': fpk = '01'; break;
    case 'p2': fpk = '02'; break;
    default: break;
  }
  fpk += utility.buf2hex(utility.b58cdecode(pk, prefix[pk.substr(0, 4)]));
  return fpk;
};

/**
 * @description Forge operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
forge.op = (op: ConstructedOperation): string => {
  /* eslint-disable */
  let fop = '';
  fop = utility.buf2hex(new Uint8Array([forgeMappings.forgeOpTags[op.kind]]));
  switch (forgeMappings.forgeOpTags[op.kind]) {
    case 0:
    case 1:
      fop += utility.buf2hex(forge.toBytesInt32(op.level));
      if (forgeMappings.forgeOpTags[op.kind] === 0) break;
      fop += op.nonce;
      if (forgeMappings.forgeOpTags[op.kind] === 1) break;
    case 2:
    case 3:
      throw new Error('Double bake and double endorse forging is not complete');
    // if (forgeMappings.forgeOpTags[op.kind] === 2) break;
    // if (forgeMappings.forgeOpTags[op.kind] === 3) break;
    case 4:
      fop += utility.buf2hex(utility.b58cdecode(op.pkh, prefix.tz1));
      fop += op.secret;
      if (forgeMappings.forgeOpTags[op.kind] === 4) break;
    case 5:
    case 6:
      fop += forge.publicKeyHash(op.source);
      fop += utility.buf2hex(forge.toBytesInt32(op.period));
      if (forgeMappings.forgeOpTags[op.kind] === 5) {
        throw new Error('Proposal forging is not complete');
      } else if (forgeMappings.forgeOpTags[op.kind] === 6) {
        fop += utility.buf2hex(utility.b58cdecode(op.proposal, prefix.P));
        let ballot;
        if (op.ballot === 'yay') {
          ballot = '00';
        } else if (op.ballot === 'nay') {
          ballot = '01';
        } else {
          ballot = '02';
        }
        fop += ballot;
        break;
      }
    case 7:
    case 8:
    case 9:
    case 10:
      fop += forge.address(op.source);
      fop += forge.zarith(op.fee);
      fop += forge.zarith(op.counter);
      fop += forge.zarith(op.gas_limit);
      fop += forge.zarith(op.storage_limit);
      if (forgeMappings.forgeOpTags[op.kind] === 7) {
        fop += forge.publicKey(op.public_key);
      } else if (forgeMappings.forgeOpTags[op.kind] === 8) {
        fop += forge.zarith(op.amount);
        fop += forge.address(op.destination);
        if (typeof op.parameters !== 'undefined' && op.parameters) {
          fop += forge.bool(true);
          fop += forge.parameters(op.parameters);
        } else {
          fop += forge.bool(false);
        }
      } else if (forgeMappings.forgeOpTags[op.kind] === 9) {
        const managerPubkey = op.manager_pubkey || op.managerPubkey;
        fop += forge.publicKeyHash(managerPubkey);
        fop += forge.zarith(op.balance);
        fop += forge.bool(op.spendable);
        fop += forge.bool(op.delegatable);
        if (typeof op.delegate !== 'undefined' && op.delegate) {
          fop += forge.bool(true);
          fop += forge.publicKeyHash(op.delegate);
        } else {
          fop += forge.bool(false);
        }
        if (typeof op.script !== 'undefined' && op.script) {
          fop += forge.bool(true);
          fop += forge.script(op.script);
        } else {
          fop += forge.bool(false);
        }
      } else if (forgeMappings.forgeOpTags[op.kind] === 10) {
        if (typeof op.delegate !== 'undefined' && op.delegate) {
          fop += forge.bool(true);
          fop += forge.publicKeyHash(op.delegate);
        } else {
          fop += forge.bool(false);
        }
      }
      break;
    default:
      break;
  }
  return fop;
  /* eslint-enable */
};

/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {Number} counter The current counter for the account
 * @returns {String} Forged operation bytes
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
 * }, 32847).then(({ opbytes, opOb }) => console.log(opbytes, opOb))
 */
forge.forge = async (opOb: OperationObject, counter: number): Promise<ForgedBytes> => {
  if (!opOb.contents) {
    throw new Error('No operation contents provided.');
  }

  if (!opOb.branch) {
    throw new Error('No operation branch provided.');
  }

  let forgedBytes = utility.buf2hex(utility.b58cdecode(opOb.branch, prefix.b));

  opOb.contents.forEach((content: ConstructedOperation): void => {
    forgedBytes += forge.op(content);
  });

  return {
    opbytes: forgedBytes,
    opOb,
    counter,
  };
};

/**
 * @description Decode raw bytes
 * @param {String} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
forge.decodeRawBytes = (bytes: string): any => {
  bytes = bytes.toUpperCase();

  let index = 0;
  const read = (len: number) => bytes.slice(index, index + len);

  const rec = (): any => {
    const b = read(2);
    const prim = forgeMappings.primMapping[b];

    if (prim instanceof Object) {
      index += 2;
      const op = forgeMappings.opMapping[read(2)];
      index += 2;
      const args = [...Array(prim.len)];
      const result: { prim: string; args: (string | number | boolean)[]; annots?: string[]} = {
        prim: op,
        args: args.map(() => rec()),
        annots: undefined,
      };
      if (!prim.len) {
        delete result.args;
      }
      if (prim.annots) {
        const annotsLen = parseInt(read(8), 16) * 2;
        index += 8;
        const stringHexLst = read(annotsLen).match(/[\dA-F]{2}/g);
        index += annotsLen;
        if (stringHexLst) {
          const stringBytes = new Uint8Array(stringHexLst.map(x => parseInt(x, 16)));
          const stringResult = utility.textDecode(stringBytes);
          result.annots = stringResult.split(' ');
        }
      } else {
        delete result.annots;
      }
      return result;
    }

    if (b === '0A') {
      index += 2;
      const len = read(8);
      index += 8;
      const intLen = parseInt(len, 16) * 2;
      const data = read(intLen);
      index += intLen;
      return { bytes: data };
    }

    if (b === '01') {
      index += 2;
      const len = read(8);
      index += 8;
      const intLen = parseInt(len, 16) * 2;
      const data = read(intLen);
      index += intLen;

      const matchResult = data.match(/[\dA-F]{2}/g);
      if (matchResult instanceof Array) {
        const stringRaw = new Uint8Array(matchResult.map(x => parseInt(x, 16)));
        return { string: utility.textDecode(stringRaw) };
      }

      throw new Error('Input bytes error');
    }

    if (b === '00') {
      index += 2;
      const firstBytes = parseInt(read(2), 16).toString(2).padStart(8, '0');
      index += 2;
      // const isPositive = firstBytes[1] === '0';
      const validBytes = [firstBytes.slice(2)];
      let checknext = firstBytes[0] === '1';

      while (checknext) {
        const bytesCheck = parseInt(read(2), 16).toString(2).padStart(8, '0');
        index += 2;
        validBytes.push(bytesCheck.slice(1));
        checknext = bytesCheck[0] === '1';
      }

      const num = new BigNumber(validBytes.reverse().join(''), 2);
      return { int: num.toString() };
    }

    if (b === '02') {
      index += 2;
      const len = read(8);
      index += 8;
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
 * @returns {String} Encoded value as bytes
 */
forge.encodeRawBytes = (input: any): string => {
  const rec = (inputArg: any): any => {
    const result = [];

    if (inputArg instanceof Array) {
      result.push('02');
      const bytes = inputArg.map(x => rec(x)).join('');
      const len = bytes.length / 2;
      result.push(len.toString(16).padStart(8, '0'));
      result.push(bytes);
    } else if (inputArg instanceof Object) {
      if (inputArg.prim) {
        const argsLen = inputArg.args ? inputArg.args.length : 0;
        result.push(forgeMappings.primMappingReverse[argsLen][`${!!inputArg.annots}`]);
        result.push(forgeMappings.opMappingReverse[inputArg.prim]);
        if (inputArg.args) {
          inputArg.args.forEach((arg: any) => result.push(rec(arg)));
        }
        if (inputArg.annots) {
          const annotsBytes = inputArg.annots.map((x: any) => utility.buf2hex(utility.textEncode(x))).join('20');
          result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
          result.push(annotsBytes);
        }
      } else if (inputArg.bytes) {
        const len = inputArg.bytes.length / 2;
        result.push('0A');
        result.push(len.toString(16).padStart(8, '0'));
        result.push(inputArg.bytes);
      } else if (inputArg.int) {
        const num = new BigNumber(inputArg.int, 10);
        const positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
        const binary = num.toString(2).replace('-', '');

        let pad;
        if (binary.length <= 6) {
          pad = 6;
        } else if ((binary.length - 6) % 7) {
          pad = (binary.length + 7 - (binary.length - 6)) % 7;
        } else {
          pad = binary.length;
        }

        const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
        const reversed = splitted.reverse();

        reversed[0] = positiveMark + reversed[0];
        const numHex = reversed.map((x: string, i: number) => (
          parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
            .toString(16)
            .padStart(2, '0')
        )).join('');

        result.push('00');
        result.push(numHex);
      } else if (inputArg.string) {
        const stringBytes = utility.textEncode(inputArg.string);
        const stringHex = [].slice.call(stringBytes).map((x: any) => x.toString(16).padStart(2, '0')).join('');
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

export default forge;
