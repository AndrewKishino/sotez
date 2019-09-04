import { BigNumber } from 'bignumber.js';
import toBuffer from 'typedarray-to-buffer';
import utility from './utility';
import { prefix, forgeMappings, protocols } from './constants';

import {
  ConstructedOperation,
  OperationObject,
  ForgedBytes,
} from './types/sotez';

/**
 * @description Convert bytes from Int32
 * @param {Number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
const toBytesInt32 = (num: number): any => {
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
const toBytesInt32Hex = (num: number): string => {
  const forgedBuffer = toBuffer(toBytesInt32(num));
  return utility.buf2hex(forgedBuffer);
}

/**
 * @description Forge boolean
 * @param {Boolean} bool Boolean value to convert
 * @returns {String} The converted boolean
 */
const bool = (bool: boolean): string => (bool ? 'ff' : '00');

/**
 * @description Forge script bytes
 * @param {Object} script Script to forge
 * @param {String} script.code Script code
 * @param {String} script.storage Script storage
 * @returns {String} Forged script bytes
 */
const script = (script: { code: string; storage: string }): string => {
  const t1 = encodeRawBytes(script.code).toLowerCase();
  const t2 = encodeRawBytes(script.storage).toLowerCase();
  return toBytesInt32Hex(t1.length / 2) + t1 + toBytesInt32Hex(t2.length / 2) + t2;
};

/**
 * @description Forge parameter bytes
 * @param {String} parameter Script to forge
 * @returns {String} Forged parameter bytes
 */
const parameters = (parameter: any, protocol: string): string => {
  if (protocol === protocols['005']) {
    let fp = '';
    const isDefaultParameter = parameter.entrypoint === 'default';
    fp += isDefaultParameter ? '00' : 'FF';

    if (!isDefaultParameter) {
      const parameterBytes = encodeRawBytes(parameter.value).toLowerCase();

      if (forgeMappings.entrypointMappingReverse[parameter.entrypoint]) {
        fp += forgeMappings.entrypointMappingReverse[parameter.entrypoint];
      } else {
        const stringBytes = encodeRawBytes({ string: parameter.entrypoint }).toLowerCase();
        fp += 'FF';
        fp += stringBytes.slice(8);
      }

      fp += (parameterBytes.length / 2).toString(16).padStart(8, '0');
      fp += parameterBytes;
    }

    return fp;
  } else {
    const t = encodeRawBytes(parameter).toLowerCase();
    return toBytesInt32Hex(t.length / 2) + t;
  }
};

/**
 * @description Forge public key hash bytes
 * @param {String} pkh Public key hash to forge
 * @returns {String} Forged public key hash bytes
 */
const publicKeyHash = (pkh: string): string => {
  const t = parseInt(pkh.substr(2, 1), 10);
  let fpkh = `0${t - 1}`;
  const forgedBuffer = toBuffer(utility.b58cdecode(pkh, prefix[pkh.substr(0, 3)]));
  fpkh += utility.buf2hex(forgedBuffer);
  return fpkh;
};

/**
 * @description Forge address bytes
 * @param {String} address Address to forge
 * @returns {String} Forged address bytes
 */
const address = (address: string, protocol?: string): string => {
  let fa = '';
  if (address.substr(0, 1) === 'K') {
    fa += protocol === protocols['005'] ? '' : '01';
    const forgedBuffer = toBuffer(utility.b58cdecode(address, prefix.KT));
    fa += utility.buf2hex(forgedBuffer);
    fa += '00';
  } else {
    fa += protocol === protocols['005'] ? '' : '00';
    fa += publicKeyHash(address);
  }
  return fa;
};

/**
 * @description Forge zarith bytes
 * @param {Number} n Zarith to forge
 * @returns {String} Forged zarith bytes
 */
const zarith = (n: string): string => {
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
const publicKey = (pk: string): string => {
  let fpk = '';
  switch (pk.substr(0, 2)) {
    case 'ed': fpk = '00'; break;
    case 'sp': fpk = '01'; break;
    case 'p2': fpk = '02'; break;
    default: break;
  }
  const forgedBuffer = toBuffer(utility.b58cdecode(pk, prefix[pk.substr(0, 4)]));
  fpk += utility.buf2hex(forgedBuffer);
  return fpk;
};

/**
 * @description Forge operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const op = (op: ConstructedOperation, protocol: string): string => {
  let fop = '';

  let forgedBuffer;
  if (protocol === protocols['005']) {
    forgedBuffer = toBuffer(new Uint8Array([forgeMappings.forgeOpTags['005'][op.kind]]));
  } else {
    forgedBuffer = toBuffer(new Uint8Array([forgeMappings.forgeOpTags['004'][op.kind]]));
  }

  fop = utility.buf2hex(forgedBuffer);

  if (op.kind === 'endorsement') {
    fop += endorsement(op);
  } else if (op.kind === 'seed_nonce_revelation') {
    fop += seedNonceRevelation(op);
  } else if (op.kind === 'double_endorsement_evidence') {
    fop += doubleEndorsementEvidence(op);
  } else if (op.kind === 'double_baking_evidence') {
    fop += doubleBakingEvidence(op);
  } else if (op.kind === 'activate_account') {
    fop += activateAccount(op);
  } else if (op.kind === 'proposals') {
    fop += proposals(op);
  } else if (op.kind === 'ballot') {
    fop += ballot(op);
  } else if (op.kind === 'reveal') {
    fop += reveal(op, protocol);
  } else if (op.kind === 'transaction') {
    fop += transaction(op, protocol);
  } else if (op.kind === 'origination') {
    fop += origination(op, protocol);
  } else if (op.kind === 'delegation') {
    fop += delegation(op, protocol);
  }

  return fop;
};

/**
 * @description Forge endorsement operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 */
const endorsement = (op: ConstructedOperation) => {
  const levelBuffer = toBuffer(toBytesInt32(op.level));
  return utility.buf2hex(levelBuffer);
};

/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
const seedNonceRevelation = (op: ConstructedOperation): string => {
  let fop = '';

  const levelBuffer = toBuffer(toBytesInt32(op.level));
  fop += utility.buf2hex(levelBuffer);
  fop += op.nonce;

  return fop;
};

/**
 * @description Forge double_endorsement_evidence operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
const doubleEndorsementEvidence = (op: ConstructedOperation): string => {
  throw new Error('Double endorse forging is not complete');
}

/**
 * @description Forge double_baking_evidence operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const doubleBakingEvidence = (op: ConstructedOperation): string => {
  throw new Error('Double bake forging is not complete');
}

/**
 * @description Forge activate_account operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
const activateAccount = (op: ConstructedOperation): string => {
  let fop = '';

  const addressBuffer = toBuffer(utility.b58cdecode(op.pkh, prefix.tz1));
  fop += utility.buf2hex(addressBuffer);
  fop += op.secret;

  return fop;
};

/**
 * @description Forge proposals operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
const proposals = (op: ConstructedOperation): string => {
  throw new Error('Proposal forging is not complete');
};

/**
 * @description Forge ballot operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
const ballot = (op: ConstructedOperation): string => {
  let fop = '';

  fop += publicKeyHash(op.source);
  const periodBuffer = toBuffer(toBytesInt32(op.period));
  fop += utility.buf2hex(periodBuffer);
  const forgedBuffer = toBuffer(utility.b58cdecode(op.proposal, prefix.P));
  fop += utility.buf2hex(forgedBuffer);
  let ballot;
  if (op.ballot === 'yay' || op.ballot === 'yea') {
    ballot = '00';
  } else if (op.ballot === 'nay') {
    ballot = '01';
  } else {
    ballot = '02';
  }
  fop += ballot;

  return fop;
};

/**
 * @description Forge reveal operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const reveal = (op: ConstructedOperation, protocol: string): string => {
  let fop = '';

  fop += address(op.source, protocol);
  fop += zarith(op.fee);
  fop += zarith(op.counter);
  fop += zarith(op.gas_limit);
  fop += zarith(op.storage_limit);
  fop += publicKey(op.public_key);

  return fop;
};

/**
 * @description Forge transaction operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const transaction = (op: ConstructedOperation, protocol: string): string => {
  let fop = '';

  fop += address(op.source, protocol);
  fop += zarith(op.fee);
  fop += zarith(op.counter);
  fop += zarith(op.gas_limit);
  fop += zarith(op.storage_limit);
  fop += zarith(op.amount);
  fop += address(op.destination);

  if (op.parameters) {
    fop += bool(true);
    fop += parameters(op.parameters, protocol);
  } else {
    fop += bool(false);
  }

  return fop;
};

/**
 * @description Forge origination operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const origination = (op: ConstructedOperation, protocol: string): string => {
  let fop = ''

  fop += address(op.source, protocol);
  fop += zarith(op.fee);
  fop += zarith(op.counter);
  fop += zarith(op.gas_limit);
  fop += zarith(op.storage_limit);

  if (protocol === protocols['005']) {
    fop += zarith(op.balance);
    if (op.delegate) {
      fop += bool(true);
      fop += publicKeyHash(op.delegate);
    } else {
      fop += bool(false);
    }
    fop += script(op.script);
  } else {
    fop += publicKeyHash(op.manager_pubkey);
    fop += zarith(op.balance);
    fop += bool(op.spendable);
    fop += bool(op.delegatable);
    if (op.delegate) {
      fop += bool(true);
      fop += publicKeyHash(op.delegate);
    } else {
      fop += bool(false);
    }
    if (op.script) {
      fop += bool(true);
      fop += script(op.script);
    } else {
      fop += bool(false);
    }
  }

  return fop;
};

/**
 * @description Forge delegation operation bytes
 * @param {Object} op Operation to forge
 * @param {String} protocol Current protocol
 * @returns {String} Forged operation bytes
 */
const delegation = (op: ConstructedOperation, protocol: string): string => {
  let fop = '';

  fop += address(op.source, protocol);
  fop += zarith(op.fee);
  fop += zarith(op.counter);
  fop += zarith(op.gas_limit);
  fop += zarith(op.storage_limit);

  if (op.delegate) {
    fop += bool(true);
    fop += publicKeyHash(op.delegate);
  } else {
    fop += bool(false);
  }

  return fop;
};

/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {Number} counter The current counter for the account
 * @returns {String} Forged operation bytes
 * ```javascript
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
 * ```
 */
const forge = async (opOb: OperationObject, counter: number, protocol: string): Promise<ForgedBytes> => {
  if (!opOb.contents) {
    throw new Error('No operation contents provided.');
  }

  if (!opOb.branch) {
    throw new Error('No operation branch provided.');
  }

  const forgedBuffer = toBuffer(utility.b58cdecode(opOb.branch, prefix.b));
  let forgedBytes = utility.buf2hex(forgedBuffer);

  opOb.contents.forEach((content: ConstructedOperation): void => {
    forgedBytes += op(content, protocol);
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
const decodeRawBytes = (bytes: string): any => {
  bytes = bytes.toUpperCase();

  let index = 0;
  const read = (len: number) => {
    const readBytes = bytes.slice(index, index + len);
    index += len;
    return readBytes;
  };

  const rec = (): any => {
    const b = read(2);
    const prim = forgeMappings.primMapping[b];

    if (prim instanceof Object) {
      const op = forgeMappings.opMapping[read(2)];
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
        const stringHexLst = read(annotsLen).match(/[\dA-F]{2}/g);
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
 * @returns {String} Encoded value as bytes
 */
const encodeRawBytes = (input: any): string => {
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
          const annotsBytes = inputArg.annots.map((x: any) => {
            const forgedBuffer = toBuffer(utility.textEncode(x));
            return utility.buf2hex(forgedBuffer);
          }).join('20');
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
        const pad = binary.length <= 6
          ? 6
          : (binary.length - 6) % 7
            ? binary.length + 7 - (binary.length - 6) % 7
            : binary.length;

        const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
        const reversed = splitted.reverse();

        reversed[0] = positiveMark + reversed[0];

        const numHex = reversed.map((x: string, i: number) => parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
          .toString(16)
          .padStart(2, '0')).join('');

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
