import { BigNumber } from 'bignumber.js';
import { buf2hex, b58cdecode, textDecode, textEncode } from './utility';
import { prefix, forgeMappings, protocols } from './constants';

interface ConstructedOperation {
  kind: string;
  level: number;
  nonce: string;
  pkh: string;
  hash: string;
  secret: string;
  source: string;
  period: number;
  proposal: string;
  ballot: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  parameters: string;
  balance: string;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  amount: string;
  destination: string;
  public_key: string;
  script: { code: Micheline; storage: Micheline };
  manager_pubkey: string;
  managerPubkey: string;
}

interface OperationObject {
  branch?: string;
  contents?: ConstructedOperation[];
  protocol?: string;
  signature?: string;
}

interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

type Micheline =
  | {
      entrypoint: string;
      value:
        | {
            prim: string;
            args?: MichelineArray;
            annots?: string[];
          }
        | { bytes: string }
        | { int: string }
        | { string: string }
        | { address: string }
        | { contract: string }
        | { key: string }
        | { key_hash: string }
        | { signature: string }
        | MichelineArray;
    }
  | {
      prim: string;
      args?: MichelineArray;
      annots?: string[];
    }
  | { bytes: string }
  | { int: string }
  | { string: string }
  | { address: string }
  | { contract: string }
  | { key: string }
  | { key_hash: string }
  | { signature: string }
  | MichelineArray;

type MichelineArray = Array<Micheline>;

/**
 * @description Convert bytes from Int32
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
export const toBytesInt32 = (num: number): any => {
  // @ts-ignore
  num = parseInt(num, 10);
  const arr = new Uint8Array([
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
export const toBytesInt32Hex = (num: number): string => {
  const forgedBuffer = new Uint8Array(toBytesInt32(num));
  return buf2hex(forgedBuffer);
};

/**
 * @description Forge boolean
 * @param {boolean} boolArg Boolean value to convert
 * @returns {string} The converted boolean
 */
export const bool = (boolArg: boolean): string => (boolArg ? 'ff' : '00');

/**
 * @description Forge script bytes
 * @param {Object} scriptArg Script to forge
 * @param {string} scriptArg.code Script code
 * @param {string} scriptArg.storage Script storage
 * @returns {string} Forged script bytes
 */
export const script = (scriptArg: {
  code: Micheline;
  storage: Micheline;
}): string => {
  const t1 = encodeRawBytes(scriptArg.code).toLowerCase();
  const t2 = encodeRawBytes(scriptArg.storage).toLowerCase();
  return (
    toBytesInt32Hex(t1.length / 2) + t1 + toBytesInt32Hex(t2.length / 2) + t2
  );
};

/**
 * @description Forge parameter bytes
 * @param {string} parameter Script to forge
 * @param {string} protocol The current block protocol
 * @returns {string} Forged parameter bytes
 */
export const parameters = (parameter: any, protocol: string): string => {
  const parameters001 = (parameterArg: any): string => {
    const fp: Array<string> = [];
    fp.push(bool(true));
    const t = encodeRawBytes(parameterArg).toLowerCase();
    fp.push(toBytesInt32Hex(t.length / 2) + t);
    return fp.join('');
  };

  const parameters005 = (parameterArg: any): string => {
    const fp: Array<string> = [];
    const isDefaultParameter = parameterArg.entrypoint === 'default';
    fp.push(isDefaultParameter ? '00' : 'FF');

    if (!isDefaultParameter) {
      const parameterBytes = encodeRawBytes(parameterArg.value).toLowerCase();

      if (forgeMappings.entrypointMappingReverse[parameterArg.entrypoint]) {
        fp.push(
          forgeMappings.entrypointMappingReverse[parameterArg.entrypoint],
        );
      } else {
        const stringBytes = encodeRawBytes({
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

  const protocolMap = {
    [`${protocols['001']}`]: parameters001,
    [`${protocols['002']}`]: parameters001,
    [`${protocols['003']}`]: parameters001,
    [`${protocols['004']}`]: parameters001,
    [`${protocols['005a']}`]: parameters005,
    [`${protocols['005']}`]: parameters005,
    [`${protocols['006']}`]: parameters005,
    [`${protocols['007a']}`]: parameters005,
    [`${protocols['007']}`]: parameters005,
    [`${protocols['008a']}`]: parameters005,
    [`${protocols['008']}`]: parameters005,
  };

  if (!protocolMap[protocol]) {
    throw new Error(`Unrecognized protocol: ${protocol}`);
  }

  return protocolMap[protocol](parameter);
};

/**
 * @description Forge public key hash bytes
 * @param {string} pkh Public key hash to forge
 * @returns {string} Forged public key hash bytes
 */
export const publicKeyHash = (pkh: string): string => {
  const t = parseInt(pkh.substr(2, 1), 10);
  const fpkh = [`0${t - 1}`];
  const forgedBuffer = new Uint8Array(
    b58cdecode(pkh, prefix[pkh.substring(0, 3)]),
  );
  fpkh.push(buf2hex(forgedBuffer));
  return fpkh.join('');
};

/**
 * @description Forge address bytes
 * @param {string} addressArg Address to forge
 * @param {string} [protocol=''] Current protocol
 * @returns {string} Forged address bytes
 */
export const address = (addressArg: string, protocol = ''): string => {
  const fa: Array<string> = [];

  const addressSourceBytes = {
    [`${protocols['001']}`]: true,
    [`${protocols['002']}`]: true,
    [`${protocols['003']}`]: true,
    [`${protocols['004']}`]: true,
  };

  const getAddressType = (a: string): string => {
    if (!protocol || addressSourceBytes[protocol]) {
      return a.substring(0, 1) === 'K' ? '01' : '00';
    }
    return '';
  };

  if (addressArg.substring(0, 1) === 'K') {
    fa.push(getAddressType(addressArg));
    const forgedBuffer = new Uint8Array(b58cdecode(addressArg, prefix.KT));
    fa.push(buf2hex(forgedBuffer));
    fa.push('00');
  } else {
    fa.push(getAddressType(addressArg));
    fa.push(publicKeyHash(addressArg));
  }
  return fa.join('');
};

/**
 * @description Forge zarith bytes
 * @param {number} n Zarith to forge
 * @returns {string} Forged zarith bytes
 */
export const zarith = (n: string): string => {
  const fn: Array<string> = [];
  let nn = new BigNumber(n, 10);
  if (nn.isNaN()) {
    throw new TypeError(`Error forging zarith ${n}`);
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (nn.lt(128)) {
      if (nn.lt(16)) fn.push('0');
      fn.push(nn.toString(16));
      break;
    } else {
      let b = nn.mod(128);
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
export const publicKey = (pk: string): string => {
  const fpk: Array<string> = [];
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
  const forgedBuffer = new Uint8Array(
    b58cdecode(pk, prefix[pk.substring(0, 4)]),
  );
  fpk.push(buf2hex(forgedBuffer));
  return fpk.join('');
};

/**
 * @description Forge operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export const op = (opArg: ConstructedOperation, protocol: string): string => {
  const opTag001 = (opKind: string): any =>
    new Uint8Array(new Uint8Array([forgeMappings.forgeOpTags['001'][opKind]]));

  const opTag005 = (opKind: string): any =>
    new Uint8Array(new Uint8Array([forgeMappings.forgeOpTags['005'][opKind]]));

  const protocolMap = {
    [`${protocols['001']}`]: opTag001,
    [`${protocols['002']}`]: opTag001,
    [`${protocols['003']}`]: opTag001,
    [`${protocols['004']}`]: opTag001,
    [`${protocols['005a']}`]: opTag005,
    [`${protocols['005']}`]: opTag005,
    [`${protocols['006']}`]: opTag005,
    [`${protocols['007a']}`]: opTag005,
    [`${protocols['007']}`]: opTag005,
    [`${protocols['008a']}`]: opTag005,
    [`${protocols['008']}`]: opTag005,
  };

  if (!protocolMap[protocol]) {
    throw new Error(`Unrecognized protocol: ${protocol}`);
  }

  const fop: Array<string> = [];

  const forgedBuffer = protocolMap[protocol](opArg.kind);

  fop.push(buf2hex(forgedBuffer));

  if (opArg.kind === 'endorsement') {
    fop.push(endorsement(opArg));
  } else if (opArg.kind === 'seed_nonce_revelation') {
    fop.push(seedNonceRevelation(opArg));
  } else if (opArg.kind === 'double_endorsement_evidence') {
    fop.push(doubleEndorsementEvidence());
  } else if (opArg.kind === 'double_baking_evidence') {
    fop.push(doubleBakingEvidence());
  } else if (opArg.kind === 'activate_account') {
    fop.push(activateAccount(opArg));
  } else if (opArg.kind === 'proposals') {
    fop.push(proposals());
  } else if (opArg.kind === 'ballot') {
    fop.push(ballot(opArg));
  } else if (opArg.kind === 'reveal') {
    fop.push(reveal(opArg, protocol));
  } else if (opArg.kind === 'transaction') {
    fop.push(transaction(opArg, protocol));
  } else if (opArg.kind === 'origination') {
    fop.push(origination(opArg, protocol));
  } else if (opArg.kind === 'delegation') {
    fop.push(delegation(opArg, protocol));
  }

  return fop.join('');
};

/**
 * @description Forge endorsement operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export const endorsement = (opArg: ConstructedOperation): string => {
  const levelBuffer = new Uint8Array(toBytesInt32(opArg.level));
  return buf2hex(levelBuffer);
};

/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export const seedNonceRevelation = (opArg: ConstructedOperation): string => {
  const fop: Array<string> = [];

  const levelBuffer = new Uint8Array(toBytesInt32(opArg.level));
  fop.push(buf2hex(levelBuffer));
  fop.push(opArg.nonce);

  return fop.join('');
};

// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge double_endorsement_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
export const doubleEndorsementEvidence = (): string => {
  throw new Error('Double endorse forging is not complete');
};

// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge double_baking_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
export const doubleBakingEvidence = (): string => {
  throw new Error('Double bake forging is not complete');
};

/**
 * @description Forge activate_account operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export const activateAccount = (opArg: ConstructedOperation): string => {
  const fop: Array<string> = [];

  const addressBuffer = new Uint8Array(b58cdecode(opArg.pkh, prefix.tz1));
  fop.push(buf2hex(addressBuffer));
  fop.push(opArg.secret);

  return fop.join('');
};

// eslint-disable-next-line jsdoc/require-returns-check
/**
 * @description Forge proposals operation bytes
 * @returns {string} Forged operation bytes
 */
export const proposals = (): string => {
  throw new Error('Proposal forging is not complete');
};

/**
 * @description Forge ballot operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export const ballot = (opArg: ConstructedOperation): string => {
  const fop: Array<string> = [];

  fop.push(publicKeyHash(opArg.source));
  const periodBuffer = new Uint8Array(toBytesInt32(opArg.period));
  fop.push(buf2hex(periodBuffer));
  const forgedBuffer = new Uint8Array(b58cdecode(opArg.proposal, prefix.P));
  fop.push(buf2hex(forgedBuffer));
  let ballotBytes;
  if (opArg.ballot === 'yay' || opArg.ballot === 'yea') {
    ballotBytes = '00';
  } else if (opArg.ballot === 'nay') {
    ballotBytes = '01';
  } else {
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
export const reveal = (
  opArg: ConstructedOperation,
  protocol: string,
): string => {
  const fop: Array<string> = [];

  fop.push(address(opArg.source, protocol));
  fop.push(zarith(opArg.fee));
  fop.push(zarith(opArg.counter));
  fop.push(zarith(opArg.gas_limit));
  fop.push(zarith(opArg.storage_limit));
  fop.push(publicKey(opArg.public_key));

  return fop.join('');
};

/**
 * @description Forge transaction operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export const transaction = (
  opArg: ConstructedOperation,
  protocol: string,
): string => {
  const fop = [];

  fop.push(address(opArg.source, protocol));
  fop.push(zarith(opArg.fee));
  fop.push(zarith(opArg.counter));
  fop.push(zarith(opArg.gas_limit));
  fop.push(zarith(opArg.storage_limit));
  fop.push(zarith(opArg.amount));
  fop.push(address(opArg.destination));

  if (opArg.parameters) {
    fop.push(parameters(opArg.parameters, protocol));
  } else {
    fop.push(bool(false));
  }

  return fop.join('');
};

/**
 * @description Forge origination operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export const origination = (
  opArg: ConstructedOperation,
  protocol: string,
): string => {
  const origination001 = (
    o: ConstructedOperation,
    forgedOp: Array<string>,
  ): string => {
    forgedOp.push(publicKeyHash(o.manager_pubkey));
    forgedOp.push(zarith(o.balance));
    forgedOp.push(bool(o.spendable));
    forgedOp.push(bool(o.delegatable));
    if (o.delegate) {
      forgedOp.push(bool(true));
      forgedOp.push(publicKeyHash(o.delegate));
    } else {
      forgedOp.push(bool(false));
    }
    if (o.script) {
      forgedOp.push(bool(true));
      forgedOp.push(script(o.script));
    } else {
      forgedOp.push(bool(false));
    }
    return forgedOp.join('');
  };

  const origination005 = (
    o: ConstructedOperation,
    forgedOp: Array<string>,
  ): string => {
    forgedOp.push(zarith(o.balance));
    if (o.delegate) {
      forgedOp.push(bool(true));
      forgedOp.push(publicKeyHash(o.delegate));
    } else {
      forgedOp.push(bool(false));
    }
    forgedOp.push(script(o.script));
    return forgedOp.join('');
  };

  const protocolMap = {
    [`${protocols['001']}`]: origination001,
    [`${protocols['002']}`]: origination001,
    [`${protocols['003']}`]: origination001,
    [`${protocols['004']}`]: origination001,
    [`${protocols['005a']}`]: origination005,
    [`${protocols['005']}`]: origination005,
    [`${protocols['006']}`]: origination005,
    [`${protocols['007a']}`]: origination005,
    [`${protocols['007']}`]: origination005,
    [`${protocols['008a']}`]: origination005,
    [`${protocols['008']}`]: origination005,
  };

  const fop: Array<string> = [];

  fop.push(address(opArg.source, protocol));
  fop.push(zarith(opArg.fee));
  fop.push(zarith(opArg.counter));
  fop.push(zarith(opArg.gas_limit));
  fop.push(zarith(opArg.storage_limit));

  return protocolMap[protocol](opArg, fop);
};

/**
 * @description Forge delegation operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export const delegation = (
  opArg: ConstructedOperation,
  protocol: string,
): string => {
  const fop: Array<string> = [];

  fop.push(address(opArg.source, protocol));
  fop.push(zarith(opArg.fee));
  fop.push(zarith(opArg.counter));
  fop.push(zarith(opArg.gas_limit));
  fop.push(zarith(opArg.storage_limit));

  if (opArg.delegate) {
    fop.push(bool(true));
    fop.push(publicKeyHash(opArg.delegate));
  } else {
    fop.push(bool(false));
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
export const forge = async (
  opOb: OperationObject,
  counter: number,
  protocol: string,
): Promise<ForgedBytes> => {
  if (!opOb.contents) {
    throw new Error('No operation contents provided.');
  }

  if (!opOb.branch) {
    throw new Error('No operation branch provided.');
  }

  const forgedBuffer = new Uint8Array(b58cdecode(opOb.branch, prefix.b));
  const forgedBytes = [buf2hex(forgedBuffer)];

  opOb.contents.forEach((content: ConstructedOperation): void => {
    forgedBytes.push(op(content, protocol));
  });

  return {
    opbytes: forgedBytes.join(''),
    opOb,
    counter,
  };
};

/**
 * @description Decode raw bytes
 * @param {string} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
export const decodeRawBytes = (bytes: string): Micheline => {
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
      const forgeOp = forgeMappings.opMapping[read(2)];
      const args = [...Array(prim.len)];
      const result: {
        prim: string;
        args?: (string | number | boolean)[];
        annots?: string[];
      } = {
        prim: forgeOp,
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
          const stringBytes = new Uint8Array(
            stringHexLst.map((x) => parseInt(x, 16)),
          );
          const stringResult = textDecode(stringBytes);
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
        const stringRaw = new Uint8Array(
          matchResult.map((x) => parseInt(x, 16)),
        );
        return { string: textDecode(stringRaw) };
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
export const encodeRawBytes = (input: Micheline): string => {
  const rec = (inputArg: Micheline): string => {
    const result: string[] = [];

    if (inputArg instanceof Array) {
      result.push('02');
      const bytes = inputArg.map((x) => rec(x)).join('');
      const len = bytes.length / 2;
      result.push(len.toString(16).padStart(8, '0'));
      result.push(bytes);
    } else if (inputArg instanceof Object) {
      if ('prim' in inputArg) {
        const argsLen = inputArg.args ? inputArg.args.length : 0;
        result.push(
          forgeMappings.primMappingReverse[argsLen][`${!!inputArg.annots}`],
        );
        result.push(forgeMappings.opMappingReverse[inputArg.prim]);
        if (inputArg.args) {
          inputArg.args.forEach((arg: any) => result.push(rec(arg)));
        }
        if (inputArg.annots) {
          const annotsBytes = inputArg.annots
            .map((x: any) => {
              const forgedBuffer = new Uint8Array(textEncode(x));
              return buf2hex(forgedBuffer);
            })
            .join('20');
          result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
          result.push(annotsBytes);
        }
      } else if ('bytes' in inputArg) {
        const len = inputArg.bytes.length / 2;
        result.push('0A');
        result.push(len.toString(16).padStart(8, '0'));
        result.push(inputArg.bytes);
      } else if ('int' in inputArg) {
        const num = new BigNumber(inputArg.int, 10);
        const positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
        const binary = num.toString(2).replace('-', '');
        const pad =
          // eslint-disable-next-line no-nested-ternary
          binary.length <= 6
            ? 6
            : (binary.length - 6) % 7
            ? binary.length + 7 - ((binary.length - 6) % 7)
            : binary.length;

        const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g) || [];
        const reversed = splitted.reverse();

        reversed[0] = positiveMark + reversed[0];

        const numHex = reversed
          .map((x: string, i: number) =>
            parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
              .toString(16)
              .padStart(2, '0'),
          )
          .join('');

        result.push('00');
        result.push(numHex);
      } else if ('string' in inputArg) {
        const stringBytes = textEncode(inputArg.string);
        const stringHex = [].slice
          .call(stringBytes)
          .map((x: any) => x.toString(16).padStart(2, '0'))
          .join('');
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
