/// <reference types="node" />
/**
 * Creates a key object from a base58 encoded key.
 * @class Key
 * @param {String} key A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string
 * @param {String} passphrase The passphrase used if the key provided is an encrypted private key or a fundraiser key
 * @param {String} email Email used if a fundraiser key is passed
 * ```javascript
 * const key = new Key('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * await key.ready;
 * ```
 */
export default class Key {
    _curve: string;
    _publicKey: Buffer;
    _secretKey?: Buffer;
    _isSecret: boolean;
    _isLedger: boolean;
    _ledgerPath: string;
    _ledgerCurve: number;
    ready: Promise<void>;
    constructor(key: string, passphrase?: string, email?: string);
    readonly curve: string;
    isLedger: boolean;
    ledgerPath: string;
    ledgerCurve: number;
    /**
     * @memberof Key
     * @description Returns the public key
     * @returns {String} The public key associated with the private key
     */
    publicKey: () => string;
    /**
     * @memberof Key
     * @description Returns the secret key
     * @returns {String} The secret key associated with this key, if available
     */
    secretKey: () => string;
    /**
     * @memberof Key
     * @description Returns public key hash for this key
     * @returns {String} The public key hash for this key
     */
    publicKeyHash: () => string;
    initialize: (key: string, passphrase?: string | undefined, email?: string | undefined, ready?: any) => Promise<void>;
    /**
     * @memberof Key
     * @description Sign a raw sequence of bytes
     * @param {String} bytes Sequence of bytes, raw format or hexadecimal notation
     * @param {Uint8Array} watermark The watermark bytes
     * @returns {String} The public key hash for this key
     */
    sign: (bytes: string, watermark: Uint8Array) => Promise<{
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }>;
}
