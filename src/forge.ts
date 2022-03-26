import { BigNumber } from 'bignumber.js';
import { buf2hex, b58cdecode, textDecode, textEncode } from './utility';
import { prefix, forgeMappings } from './constants';

interface Operation {
  kind: string;
  level?: number;
  nonce?: string;
  pkh?: string;
  hash?: string;
  secret?: string;
  source?: string;
  period?: number;
  proposal?: string;
  ballot?: string;
  fee?: string;
  counter?: string;
  gas_limit?: string;
  storage_limit?: string;
  parameters?: Micheline;
  balance?: string;
  delegate?: string;
  amount?: string;
  destination?: string;
  public_key?: string;
  script?: { code: Micheline; storage: Micheline };
}

interface OperationObject {
  branch?: string;
  contents?: Operation[];
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
 * @description Convert bytes from Int16
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
export const toBytesInt16 = (num: number): any => {
  // @ts-ignore
  num = parseInt(num, 10);
  const arr = new Uint8Array([(num & 0xff00) >> 8, num & 0x00ff]);
  return arr.buffer;
};

/**
 * @description Convert hex from Int16
 * @param {number} num Number to convert to hex
 * @returns {string} The converted number
 */
export const toBytesInt16Hex = (num: number): string => {
  const forgedBuffer = new Uint8Array(toBytesInt16(num));
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
 * @returns {string} Forged parameter bytes
 */
export const parameters = (parameter: any): string => {
  const fp: string[] = [];
  const isDefaultParameter = parameter.entrypoint === 'default';
  fp.push(isDefaultParameter ? '00' : 'FF');

  if (!isDefaultParameter) {
    const parameterBytes = encodeRawBytes(parameter.value).toLowerCase();

    if (forgeMappings.entrypointMappingReverse[parameter.entrypoint]) {
      fp.push(forgeMappings.entrypointMappingReverse[parameter.entrypoint]);
    } else {
      const stringBytes = encodeRawBytes({
        string: parameter.entrypoint,
      }).toLowerCase();
      fp.push('FF');
      fp.push(stringBytes.slice(8));
    }

    fp.push((parameterBytes.length / 2).toString(16).padStart(8, '0'));
    fp.push(parameterBytes);
  }

  return fp.join('');
};

/**
 * @description Forge public key hash bytes
 * @param {string} pkh Public key hash to forge
 * @returns {string} Forged public key hash bytes
 */
export const publicKeyHash = (pkh: string): string => {
  const t = parseInt(pkh.substring(2, 3), 10);
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
 * @returns {string} Forged address bytes
 */
export const address = (addressArg: string): string => {
  const fa: string[] = [];

  if (addressArg.substring(0, 1) === 'K') {
    fa.push('01');
    const forgedBuffer = new Uint8Array(b58cdecode(addressArg, prefix.KT));
    fa.push(buf2hex(forgedBuffer));
    fa.push('00');
  } else {
    fa.push('00');
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
  const fn: string[] = [];
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
  const fpk: string[] = [];
  const keyPrefix = pk.substring(0, 2);

  if (keyPrefix === 'ed') {
    fpk.push('00');
  }

  if (keyPrefix === 'sp') {
    fpk.push('01');
  }

  if (keyPrefix === 'p2') {
    fpk.push('02');
  }

  const forgedBuffer = new Uint8Array(
    b58cdecode(pk, prefix[pk.substring(0, 4)]),
  );
  fpk.push(buf2hex(forgedBuffer));
  return fpk.join('');
};

/**
 * @description Forge operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const operation = (op: Operation): string => {
  const fop: string[] = [];

  const forgedBuffer = new Uint8Array([
    forgeMappings.forgeOpTags['009'][op.kind],
  ]);

  fop.push(buf2hex(forgedBuffer));

  if (op.kind === 'endorsement') {
    fop.push(endorsement(op));
  } else if (op.kind === 'seed_nonce_revelation') {
    fop.push(seedNonceRevelation(op));
  } else if (op.kind === 'double_endorsement_evidence') {
    fop.push(doubleEndorsementEvidence());
  } else if (op.kind === 'double_baking_evidence') {
    fop.push(doubleBakingEvidence());
  } else if (op.kind === 'activate_account') {
    fop.push(activateAccount(op));
  } else if (op.kind === 'proposals') {
    fop.push(proposals());
  } else if (op.kind === 'ballot') {
    fop.push(ballot(op));
  } else if (op.kind === 'reveal') {
    fop.push(reveal(op));
  } else if (op.kind === 'transaction') {
    fop.push(transaction(op));
  } else if (op.kind === 'origination') {
    fop.push(origination(op));
  } else if (op.kind === 'delegation') {
    fop.push(delegation(op));
  }

  return fop.join('');
};

/**
 * @description Forge endorsement operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const endorsement = (op: Operation): string => {
  if (!op.level) {
    throw new Error('Endorsement operation malformed. Missing level.');
  }
  const levelBuffer = new Uint8Array(toBytesInt32(op.level));
  return buf2hex(levelBuffer);
};

/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const seedNonceRevelation = (op: Operation): string => {
  const fop: string[] = [];

  if (!op.level || !op.nonce) {
    throw new Error(
      'SeedNonceRevelation operation malformed. Missing level or nonce.',
    );
  }

  const levelBuffer = new Uint8Array(toBytesInt32(op.level));
  fop.push(buf2hex(levelBuffer));
  fop.push(op.nonce);

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
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const activateAccount = (op: Operation): string => {
  const fop: string[] = [];

  if (!op.pkh || !op.secret) {
    throw new Error(
      'ActivateAccount operation malformed. Missing pkh or secret.',
    );
  }

  const addressBuffer = new Uint8Array(b58cdecode(op.pkh, prefix.tz1));
  fop.push(buf2hex(addressBuffer));
  fop.push(op.secret);

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
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const ballot = (op: Operation): string => {
  const fop: string[] = [];

  if (!op.source || !op.period || !op.proposal) {
    throw new Error(
      'Ballot operation malformed. Missing source, period, or proposal.',
    );
  }

  fop.push(publicKeyHash(op.source));
  const periodBuffer = new Uint8Array(toBytesInt32(op.period));
  fop.push(buf2hex(periodBuffer));
  const forgedBuffer = new Uint8Array(b58cdecode(op.proposal, prefix.P));
  fop.push(buf2hex(forgedBuffer));
  let ballotBytes;
  if (op.ballot === 'yay' || op.ballot === 'yea') {
    ballotBytes = '00';
  } else if (op.ballot === 'nay') {
    ballotBytes = '01';
  } else {
    ballotBytes = '02';
  }
  fop.push(ballotBytes);

  return fop.join('');
};

/**
 * @description Forge reveal operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const reveal = (op: Operation): string => {
  if (
    !op.source ||
    !op.fee ||
    !op.counter ||
    !op.gas_limit ||
    !op.storage_limit ||
    !op.public_key
  ) {
    throw new Error(
      'Reveal operation malformed. Missing source, fee, counter, gas_limit, storage_limit, or public_key.',
    );
  }

  const fop: string[] = [];

  fop.push(publicKeyHash(op.source));
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
 * @returns {string} Forged operation bytes
 */
export const transaction = (op: Operation): string => {
  if (
    !op.source ||
    !op.fee ||
    !op.counter ||
    !op.gas_limit ||
    !op.storage_limit ||
    !op.amount ||
    !op.destination
  ) {
    throw new Error(
      'Reveal operation malformed. Missing source, fee, counter, gas_limit, storage_limit, amount, or destination.',
    );
  }

  const fop = [];

  fop.push(publicKeyHash(op.source));
  fop.push(zarith(op.fee));
  fop.push(zarith(op.counter));
  fop.push(zarith(op.gas_limit));
  fop.push(zarith(op.storage_limit));
  fop.push(zarith(op.amount));
  fop.push(address(op.destination));

  if (op.parameters) {
    fop.push(parameters(op.parameters));
  } else {
    fop.push(bool(false));
  }

  return fop.join('');
};

/**
 * @description Forge origination operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const origination = (op: Operation): string => {
  if (
    !op.source ||
    !op.fee ||
    !op.counter ||
    !op.gas_limit ||
    !op.storage_limit ||
    !op.balance ||
    !op.script
  ) {
    throw new Error(
      'Reveal operation malformed. Missing source, fee, counter, gas_limit, storage_limit, balance, or script.',
    );
  }

  const fop: string[] = [];

  fop.push(publicKeyHash(op.source));
  fop.push(zarith(op.fee));
  fop.push(zarith(op.counter));
  fop.push(zarith(op.gas_limit));
  fop.push(zarith(op.storage_limit));
  fop.push(zarith(op.balance));
  if (op.delegate) {
    fop.push(bool(true));
    fop.push(publicKeyHash(op.delegate));
  } else {
    fop.push(bool(false));
  }
  fop.push(script(op.script));

  return fop.join('');
};

/**
 * @description Forge delegation operation bytes
 * @param {Object} op Operation to forge
 * @returns {string} Forged operation bytes
 */
export const delegation = (op: Operation): string => {
  if (
    !op.source ||
    !op.fee ||
    !op.counter ||
    !op.gas_limit ||
    !op.storage_limit
  ) {
    throw new Error(
      'Reveal operation malformed. Missing source, fee, counter, gas_limit or storage_limit.',
    );
  }

  const fop: string[] = [];

  fop.push(publicKeyHash(op.source));
  fop.push(zarith(op.fee));
  fop.push(zarith(op.counter));
  fop.push(zarith(op.gas_limit));
  fop.push(zarith(op.storage_limit));

  if (op.delegate) {
    fop.push(bool(true));
    fop.push(publicKeyHash(op.delegate));
  } else {
    fop.push(bool(false));
  }

  return fop.join('');
};

/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {number} counter The current counter for the account
 * @param {string} protocol The next protocol for the operation. Used to handle protocol upgrade events if necessary.
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  opOb.contents.forEach((content: Operation): void => {
    forgedBytes.push(operation(content));
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
        if (inputArg.prim === 'LAMBDA') {
          result.push('09');
          result.push(forgeMappings.opMappingReverse[inputArg.prim]);
          if (inputArg.args) {
            const innerResult: string[] = [];
            inputArg.args.forEach((arg) => {
              innerResult.push(rec(arg));
            });
            const len = innerResult.join('').length / 2;
            result.push(len.toString(16).padStart(8, '0'));
            innerResult.forEach((x) => result.push(x));
          }
          const annotsBytes = inputArg.annots
            ? inputArg.annots
                .map((x) => buf2hex(new Uint8Array(textEncode(x))))
                .join('20')
            : '';
          result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
          if (annotsBytes) {
            result.push(annotsBytes);
          }
        } else {
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
  operation,
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
