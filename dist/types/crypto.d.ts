interface Keys {
    pk: string;
    pkh: string;
    sk: string;
    password?: string;
}
interface KeysMnemonicPassphrase {
    mnemonic: string;
    passphrase: string;
    sk: string;
    pk: string;
    pkh: string;
}
interface Signed {
    bytes: string;
    magicBytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
}
/**
 * @description Extract key pairs from a secret key
 * @param {string} sk The secret key to extract key pairs from
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The extracted key pairs
 * @example
 * crypto.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
 *   .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
 */
export declare const extractKeys: (sk: string, password?: string) => Promise<Keys>;
/**
 * @description Generate a mnemonic
 * @returns {string} The generated mnemonic
 */
export declare const generateMnemonic: () => string;
/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {string} address The address to check
 * @returns {boolean} Whether address is valid or not
 */
export declare const checkAddress: (address: string) => boolean;
/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {string} mnemonic The mnemonic seed
 * @param {string} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 * @example
 * crypto.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 */
export declare const generateKeys: (mnemonic: string, passphrase: string) => Promise<KeysMnemonicPassphrase>;
/**
 * @description Sign bytes
 * @param {string} bytes The bytes to sign
 * @param {string} sk The secret key to sign the bytes with
 * @param {Object} magicBytes The magic bytes for the operation
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The signed bytes
 * @example
 * import { magicBytes as magicBytesMap } from 'sotez';
 *
 * crypto.sign(opbytes, keys.sk, magicBytesMap.generic)
 *   .then(({ bytes, magicBytes, sig, edsig, sbytes }) => console.log(bytes, magicBytes, sig, edsig, sbytes));
 */
export declare const sign: (bytes: string, sk: string, magicBytes: Uint8Array, password?: string) => Promise<Signed>;
/**
 * @description Verify signed bytes
 * @param {String} bytes The signed bytes
 * @param {String} sig The signature of the signed bytes
 * @param {String} pk The public key
 * @returns {Boolean} Whether the signed bytes are valid
 */
export declare const verify: (bytes: string, sig: string, pk: string) => Promise<boolean>;
declare const _default: {
    extractKeys: (sk: string, password?: string) => Promise<Keys>;
    generateKeys: (mnemonic: string, passphrase: string) => Promise<KeysMnemonicPassphrase>;
    checkAddress: (address: string) => boolean;
    generateMnemonic: () => string;
    sign: (bytes: string, sk: string, magicBytes: Uint8Array, password?: string) => Promise<Signed>;
    verify: (bytes: string, sig: string, pk: string) => Promise<boolean>;
};
export default _default;
