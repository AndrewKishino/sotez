/**
 * Creates a key object from a base58 encoded key.
 *
 * @class Key
 * @param {Object} KeyConstructor
 * @param {string} [KeyConstructor.key] A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string. Not
 *   providing a key will import a ledger public key.
 * @param {string} [KeyConstructor.passphrase] The passphrase used if the key provided is an encrypted private key or a fundraiser key
 * @param {string} [KeyConstructor.email] Email used if a fundraiser key is passed
 * @param {string} [KeyConstructor.ledgerPath="44'/1729'/0'/0'"] Ledger derivation path
 * @param {string} [KeyConstructor.ledgerCurve=tz1] Ledger curve
 * @example
 * const key = new Key({ key: 'edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y' });
 * await key.ready;
 *
 * const key = new Key({ ledgerPath: "44'/1729'/0'/1'" });
 * await key.ready;
 */
export declare class Key {
    _curve: string;
    _publicKey: Uint8Array;
    _secretKey?: Uint8Array;
    _isSecret: boolean;
    _isLedger: boolean;
    _ledgerPath: string;
    _ledgerCurve: string;
    _ledgerTransport: any;
    _salt: Uint8Array;
    ready: Promise<boolean>;
    constructor({ key, passphrase, email, ledgerPath, ledgerCurve, ledgerTransport, }?: {
        key?: string;
        passphrase?: string;
        email?: string;
        ledgerPath?: string;
        ledgerCurve?: string;
        ledgerTransport?: any;
    });
    get curve(): string;
    get isLedger(): boolean;
    set isLedger(value: boolean);
    get ledgerPath(): string;
    set ledgerPath(value: string);
    get ledgerCurve(): string;
    set ledgerCurve(value: string);
    /**
     * @memberof Key
     * @description Returns the public key
     * @returns {string} The public key associated with the private key
     */
    publicKey: () => string;
    /**
     * @memberof Key
     * @description Returns the secret key
     * @param {string} [passphrase] The password used to encrypt the secret key, if applicable
     * @returns {string} The secret key associated with this key, if available
     */
    secretKey: (passphrase?: string | undefined) => string;
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
    }, setInit: (value: boolean) => void) => Promise<void>;
    /**
     * @memberof Key
     * @description Sign a raw sequence of bytes
     * @param {string} bytes Sequence of bytes, raw format or hexadecimal notation
     * @param {Uint8Array} magicBytes The magic bytes for the operation
     * @returns {Promise} The signature object
     */
    sign: (bytes: string, magicBytes?: Uint8Array | undefined) => Promise<{
        bytes: string;
        magicBytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }>;
    /**
     * @memberof Key
     * @description Verify signature
     * @param {string} bytes Sequance of bytes, raw format or hexadecimal notation
     * @param {string} signature A signature in base58 encoding
     * @param {string} publicKey A public key
     * @returns {boolean} Whether the signature is valid
     */
    verify: (bytes: string, signature: string, publicKey?: string) => boolean;
}
