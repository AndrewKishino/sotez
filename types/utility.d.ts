import { Buffer } from 'buffer/';
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
interface MichelineArray extends Array<Micheline> {
}
declare const _default: {
    textEncode: (value: string) => Uint8Array;
    textDecode: (buffer: Uint8Array) => string;
    b582int: (v: string) => string;
    totez: (mutez: number) => number;
    mutez: (tez: number) => string;
    b58cencode: (payload: Uint8Array, prefixArg: Uint8Array) => string;
    b58cdecode: (enc: string, prefixArg: Uint8Array) => Uint8Array;
    buf2hex: (buffer: Buffer) => string;
    hex2buf: (hex: string) => Uint8Array;
    hexNonce: (length: number) => string;
    mergebuf: (b1: Uint8Array, b2: Uint8Array) => Uint8Array;
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
