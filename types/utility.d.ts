declare type Micheline = {
    prim: string;
    args?: MichelineArray;
    annots?: Array<string>;
} | {
    bytes: string;
} | {
    int: string;
} | {
    string: string;
} | {
    address: string;
} | {
    contract: string;
} | {
    key: string;
} | {
    key_hash: string;
} | {
    signature: string;
} | MichelineArray;
declare type MichelineArray = Array<Micheline>;
export declare const textEncode: (value: string) => Uint8Array;
export declare const textDecode: (buffer: Uint8Array) => string;
/**
 * @description Convert from base58 to integer
 * @param {string} v The b58 value
 * @returns {string} The converted b58 value
 */
export declare const b582int: (v: string) => string;
/**
 * @description Convert from mutez to tez
 * @param {number} mutez The amount in mutez to convert to tez
 * @returns {number} The mutez amount converted to tez
 */
export declare const totez: (mutez: number) => number;
/**
 * @description Convert from tez to mutez
 * @param {number} tez The amount in tez to convert to mutez
 * @returns {string} The tez amount converted to mutez
 */
export declare const mutez: (tez: number) => string;
/**
 * @description Base58 encode
 * @param {string | Uint8Array} payload The value to encode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {string} The base58 encoded value
 */
export declare const b58cencode: (payload: Uint8Array, prefixArg: Uint8Array) => string;
/**
 * @description Base58 decode
 * @param {string} enc The value to decode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {Object} The decoded base58 value
 */
export declare const b58cdecode: (enc: string, prefixArg: Uint8Array) => Uint8Array;
/**
 * @description Buffer to hex
 * @param {Object} buffer The buffer to convert to hex
 * @returns {string} Converted hex value
 */
export declare const buf2hex: (buffer: Uint8Array) => string;
/**
 * @description Hex to Buffer
 * @param {string} hex The hex to convert to buffer
 * @returns {Object} Converted buffer value
 */
export declare const hex2buf: (hex: string) => Uint8Array;
/**
 * @description Generate a hex nonce
 * @param {number} length The length of the nonce
 * @returns {string} The nonce of the given length
 */
export declare const hexNonce: (length: number) => string;
/**
 * @description Merge two buffers together
 * @param {Object} b1 The first buffer
 * @param {Object} b2 The second buffer
 * @returns {Object} The merged buffer
 */
export declare const mergebuf: (b1: Uint8Array, b2: Uint8Array) => Uint8Array;
/**
 * @description Encodes an expression
 * @param {string} value The value to encode
 * @returns {string} The base58 encoded expression
 */
export declare const encodeExpr: (value: string) => string;
export declare const sexp2mic: (mi: string) => Micheline;
export declare const mic2arr: (s: any) => any;
export declare const ml2mic: (mi: string) => Micheline;
export declare const ml2tzjson: (mi: string) => Micheline;
export declare const tzjson2arr: (s: any) => any;
export declare const mlraw2json: (mi: string) => Micheline;
export declare const mintotz: (mutez: number) => number;
export declare const tztomin: (tez: number) => string;
declare const _default: {
    textEncode: (value: string) => Uint8Array;
    textDecode: (buffer: Uint8Array) => string;
    b582int: (v: string) => string;
    totez: (mutez: number) => number;
    mutez: (tez: number) => string;
    b58cencode: (payload: Uint8Array, prefixArg: Uint8Array) => string;
    b58cdecode: (enc: string, prefixArg: Uint8Array) => Uint8Array;
    buf2hex: (buffer: Uint8Array) => string;
    hex2buf: (hex: string) => Uint8Array;
    hexNonce: (length: number) => string;
    mergebuf: (b1: Uint8Array, b2: Uint8Array) => Uint8Array;
    encodeExpr: (value: string) => string;
    sexp2mic: (mi: string) => Micheline;
    mic2arr: (s: any) => any;
    ml2mic: (mi: string) => Micheline;
    ml2tzjson: (mi: string) => Micheline;
    tzjson2arr: (s: any) => any;
    mlraw2json: (mi: string) => Micheline;
    mintotz: (mutez: number) => number;
    tztomin: (tez: number) => string;
};
export default _default;
