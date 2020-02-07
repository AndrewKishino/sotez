/// <reference types="node" />
/**
 * Creates a key object from a base58 encoded key.
 * @class Key
 * @param {Object} KeyConstructor
 * @param {string} [KeyConstructor.key] A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string. Not
 *   providing a key will import a ledger public key.
 * @param {string} [KeyConstructor.passphrase] The passphrase used if the key provided is an encrypted private key or a fundraiser key
 * @param {string} [KeyConstructor.email] Email used if a fundraiser key is passed
 * @param {string} [KeyConstructor.ledgerPath="44'/1729'/0'/0'"] Ledger derivation path
 * @param {number} [KeyConstructor.ledgerCurve=0x00] Ledger curve
 * @example
 * const key = new Key({ key: 'edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y' });
 * await key.ready;
 *
 * const key = new Key({ ledgerPath: "44'/1729'/0'/1'" });
 * await key.ready;
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
    constructor({ key, passphrase, email, ledgerPath, ledgerCurve, }?: {
        key?: string;
        passphrase?: string;
        email?: string;
        ledgerPath?: string;
        ledgerCurve?: number;
    });
    get curve(): string;
    get isLedger(): boolean;
    set isLedger(value: boolean);
    get ledgerPath(): string;
    set ledgerPath(value: string);
    get ledgerCurve(): number;
    set ledgerCurve(value: number);
    /**
     * @memberof Key
     * @description Returns the public key
     * @returns {string} The public key associated with the private key
     */
    publicKey: () => string;
    /**
     * @memberof Key
     * @description Returns the secret key
     * @returns {string} The secret key associated with this key, if available
     */
    secretKey: () => string;
    /**
     * @memberof Key
     * @description Returns public key hash for this key
     * @returns {string} The public key hash for this key
     */
    publicKeyHash: () => string;
    initialize: ({ key, passphrase, email, }: {
        key?: string | undefined;
        passphrase?: string | undefined;
        email?: string | undefined;
    }, ready: any) => Promise<void>;
    /**
     * @memberof Key
     * @description Sign a raw sequence of bytes
     * @param {string} bytes Sequence of bytes, raw format or hexadecimal notation
     * @param {Uint8Array} watermark The watermark bytes
     * @returns {Promise} The signature object
     */
    sign: (bytes: string, watermark: Uint8Array) => Promise<{
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }>;
    /**
     * @memberof Key
     * @description Verify signature, throw error if it is not valid
     * @param {string} bytes Sequance of bytes, raw format or hexadecimal notation
     * @param {Uint8Array} signature A signature in base58 encoding
     * @param {string} signature A signature in base58 encoding
     */
    verify: (bytes: string, signature: string, publicKey?: string) => boolean;
}
