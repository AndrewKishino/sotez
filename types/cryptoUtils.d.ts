import { mnemonicToSeed } from 'bip39';
interface Keys {
    pk: string;
    pkh: string;
    sk: string;
    esk?: string;
    salt?: Uint8Array;
}
interface KeysMnemonicPassphrase {
    mnemonic: string;
    passphrase?: string;
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
 * @param {string} [passphrase] The password used to encrypt the sk
 * @returns {Promise} The extracted key pairs
 * @example
 * cryptoUtils.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
 *   .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
 */
export declare const extractKeys: (sk: string, passphrase?: string) => Promise<Keys>;
/**
 * @description Generate a mnemonic
 * @param {number} [numberOfWords=15] The number of words to include in the mnemonic
 * @returns {string} The generated mnemonic
 */
export declare const generateMnemonic: (numberOfWords?: number) => string;
/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {string} address The address to check
 * @returns {boolean} Whether address is valid or not
 */
export declare const checkAddress: (address: string) => boolean;
/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {string} mnemonic The mnemonic seed
 * @param {string} [passphrase] The passphrase used to salt the seed
 * @param {string} [derivationPath='m/44h/1729h/0h/0h'] Derivation path if generating keys for an HD account
 * @returns {Promise} The generated key pair
 * @example
 * cryptoUtils.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 *
 * // Or generate keys given an HD derivartion path
 * cryptoUtils.generateKeys('gym exact clown can answer hope sample mirror knife twenty powder super imitate lion churn almost shed chalk dust civil gadget pyramid helmet trade', undefined, 'm/44h/1729h/0h/0h')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 */
export declare const generateKeys: (mnemonic: string, passphrase?: string, derivationPath?: string) => Promise<KeysMnemonicPassphrase>;
/**
 * @description Encrypts a secret key with a passphrase
 * @param {string} key The secret key
 * @param {string} passphrase The passphrase to encrypt the key
 * @param {Uint8Array} salt The salt to apply to the encryption
 * @returns {string} The encrypted secret key
 * @example
 * const encryptedSecretKey = cryptoUtils.encryptSecretKey(
 *  'p2sk3T9fYpibobxRr7daoPzywLpLAXJVd3bkXpAaqYVtVB37aAp7bU',
 *  'password',
 * );
 */
export declare const encryptSecretKey: (key: string, passphrase: string, salt?: Uint8Array) => string;
/**
 * @description Sign bytes
 * @param {string} bytes The bytes to sign
 * @param {string} sk The secret key to sign the bytes with
 * @param {object} magicBytes The magic bytes for the operation
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The signed bytes
 * @example
 * import { magicBytes as magicBytesMap } from 'sotez';
 *
 * cryptoUtils.sign(opbytes, keys.sk, magicBytesMap.generic)
 *   .then(({ bytes, magicBytes, sig, prefixSig, sbytes }) => console.log(bytes, magicBytes, sig, prefixSig, sbytes));
 */
export declare const sign: (bytes: string, sk: string, magicBytes?: Uint8Array, password?: string) => Promise<Signed>;
/**
 * @description Verify signed bytes
 * @param {string} bytes The signed bytes
 * @param {string} sig The signature of the signed bytes
 * @param {string} pk The public key
 * @returns {boolean} Whether the signed bytes are valid
 */
export declare const verify: (bytes: string, sig: string, pk: string) => Promise<boolean>;
declare const _default: {
    mnemonicToSeed: typeof mnemonicToSeed;
    extractKeys: (sk: string, passphrase?: string | undefined) => Promise<Keys>;
    encryptSecretKey: (key: string, passphrase: string, salt?: Uint8Array) => string;
    generateKeys: (mnemonic: string, passphrase?: string | undefined, derivationPath?: string | undefined) => Promise<KeysMnemonicPassphrase>;
    checkAddress: (address: string) => boolean;
    generateMnemonic: (numberOfWords?: number) => string;
    sign: (bytes: string, sk: string, magicBytes?: Uint8Array | undefined, password?: string) => Promise<Signed>;
    verify: (bytes: string, sig: string, pk: string) => Promise<boolean>;
};
export default _default;
