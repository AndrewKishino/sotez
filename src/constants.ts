import { Prefix, Watermark } from './types';

export const prefix: Prefix = {
  tz1: new Uint8Array([6, 161, 159]),
  tz2: new Uint8Array([6, 161, 161]),
  tz3: new Uint8Array([6, 161, 164]),
  KT: new Uint8Array([2, 90, 121]),

  edpk: new Uint8Array([13, 15, 37, 217]),
  edsk2: new Uint8Array([13, 15, 58, 7]),
  spsk: new Uint8Array([17, 162, 224, 201]),
  p2sk: new Uint8Array([16, 81, 238, 189]),

  sppk: new Uint8Array([3, 254, 226, 86]),
  p2pk: new Uint8Array([3, 178, 139, 127]),

  edesk: new Uint8Array([7, 90, 60, 179, 41]),

  edsk: new Uint8Array([43, 246, 78, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  spsig: new Uint8Array([13, 115, 101, 19, 63]),
  p2sig: new Uint8Array([54, 240, 44, 52]),
  sig: new Uint8Array([4, 130, 43]),

  Net: new Uint8Array([87, 82, 0]),
  nce: new Uint8Array([69, 220, 169]),
  b: new Uint8Array([1, 52]),
  o: new Uint8Array([5, 116]),
  Lo: new Uint8Array([133, 233]),
  LLo: new Uint8Array([29, 159, 109]),
  P: new Uint8Array([2, 170]),
  Co: new Uint8Array([79, 179]),
  id: new Uint8Array([153, 103]),

  // Legacy prefix
  TZ: new Uint8Array([2, 90, 121]),
};

export const watermark: Watermark = {
  block: new Uint8Array([1]),
  endorsement: new Uint8Array([2]),
  generic: new Uint8Array([3]),
};

/* eslint-disable */
const opMapping: { [key: string]: string } = {
  '00': 'parameter',
  '01': 'storage',
  '02': 'code',
  '03': 'False',
  '04': 'Elt',
  '05': 'Left',
  '06': 'None',
  '07': 'Pair',
  '08': 'Right',
  '09': 'Some',
  '0A': 'True',
  '0B': 'Unit',
  '0C': 'PACK',
  '0D': 'UNPACK',
  '0E': 'BLAKE2B',
  '0F': 'SHA256',
  '10': 'SHA512',
  '11': 'ABS',
  '12': 'ADD',
  '13': 'AMOUNT',
  '14': 'AND',
  '15': 'BALANCE',
  '16': 'CAR',
  '17': 'CDR',
  '18': 'CHECK_SIGNATURE',
  '19': 'COMPARE',
  '1A': 'CONCAT',
  '1B': 'CONS',
  '1C': 'CREATE_ACCOUNT',
  '1D': 'CREATE_CONTRACT',
  '1E': 'IMPLICIT_ACCOUNT',
  '1F': 'DIP',
  '20': 'DROP',
  '21': 'DUP',
  '22': 'EDIV',
  '23': 'EMPTY_MAP',
  '24': 'EMPTY_SET',
  '25': 'EQ',
  '26': 'EXEC',
  '27': 'FAILWITH',
  '28': 'GE',
  '29': 'GET',
  '2A': 'GT',
  '2B': 'HASH_KEY',
  '2C': 'IF',
  '2D': 'IF_CONS',
  '2E': 'IF_LEFT',
  '2F': 'IF_NONE',
  '30': 'INT',
  '31': 'LAMBDA',
  '32': 'LE',
  '33': 'LEFT',
  '34': 'LOOP',
  '35': 'LSL',
  '36': 'LSR',
  '37': 'LT',
  '38': 'MAP',
  '39': 'MEM',
  '3A': 'MUL',
  '3B': 'NEG',
  '3C': 'NEQ',
  '3D': 'NIL',
  '3E': 'NONE',
  '3F': 'NOT',
  '40': 'NOW',
  '41': 'OR',
  '42': 'PAIR',
  '43': 'PUSH',
  '44': 'RIGHT',
  '45': 'SIZE',
  '46': 'SOME',
  '47': 'SOURCE',
  '48': 'SENDER',
  '49': 'SELF',
  '4A': 'STEPS_TO_QUOTA',
  '4B': 'SUB',
  '4C': 'SWAP',
  '4D': 'TRANSFER_TOKENS',
  '4E': 'SET_DELEGATE',
  '4F': 'UNIT',
  '50': 'UPDATE',
  '51': 'XOR',
  '52': 'ITER',
  '53': 'LOOP_LEFT',
  '54': 'ADDRESS',
  '55': 'CONTRACT',
  '56': 'ISNAT',
  '57': 'CAST',
  '58': 'RENAME',
  '59': 'bool',
  '5A': 'contract',
  '5B': 'int',
  '5C': 'key',
  '5D': 'key_hash',
  '5E': 'lambda',
  '5F': 'list',
  '60': 'map',
  '61': 'big_map',
  '62': 'nat',
  '63': 'option',
  '64': 'or',
  '65': 'pair',
  '66': 'set',
  '67': 'signature',
  '68': 'string',
  '69': 'bytes',
  '6A': 'mutez',
  '6B': 'timestamp',
  '6C': 'unit',
  '6D': 'operation',
  '6E': 'address',
  '6F': 'SLICE',
};
/* eslint-enable */

const opMappingReverse = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(opMapping).forEach((key: string) => {
    result[opMapping[key]] = key;
  });
  return result;
})();

const primMapping: { [key: string]: (string | { [key: string]: (number | boolean | string) }) } = {
  '00': 'int',
  '01': 'string',
  '02': 'seq',
  '03': { name: 'prim', len: 0, annots: false },
  '04': { name: 'prim', len: 0, annots: true },
  '05': { name: 'prim', len: 1, annots: false },
  '06': { name: 'prim', len: 1, annots: true },
  '07': { name: 'prim', len: 2, annots: false },
  '08': { name: 'prim', len: 2, annots: true },
  '09': { name: 'prim', len: 3, annots: true },
  '0A': 'bytes',
};

/* eslint-disable */
const primMappingReverse: { [key: string]: { [key: string]: (string | undefined) } } = {
  '0': {
    false: '03',
    true: '04',
  },
  '1': {
    false: '05',
    true: '06',
  },
  '2': {
    false: '07',
    true: '08',
  },
  '3': {
    true: '09',
  },
};
/* eslint-enable */

const forgeOpTags: { [key: string]: number } = {
  endorsement: 0,
  seed_nonce_revelation: 1,
  double_endorsement_evidence: 2,
  double_baking_evidence: 3,
  activate_account: 4,
  proposals: 5,
  ballot: 6,
  reveal: 7,
  transaction: 8,
  origination: 9,
  delegation: 10,
};

export const forgeMappings = {
  opMapping,
  opMappingReverse,
  primMapping,
  primMappingReverse,
  forgeOpTags,
};

export default {
  prefix,
  watermark,
  forgeMappings,
};
