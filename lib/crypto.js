var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateMnemonic as bip39GenerateMnemonic, mnemonicToSeed, } from 'bip39';
import * as pbkdf2 from 'pbkdf2';
import * as _sodium from 'libsodium-wrappers';
import toBuffer from 'typedarray-to-buffer';
import { b58cdecode, b58cencode, hex2buf, mergebuf, buf2hex } from './utility';
import { prefix } from './constants';
/**
 * @description Extract key pairs from a secret key
 * @param {string} sk The secret key to extract key pairs from
 * @param {string} [password] The password used to encrypt the sk
 * @returns {Promise} The extracted key pairs
 * @example
 * crypto.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
 *   .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
 */
export const extractKeys = (sk, password = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _sodium.ready;
    }
    catch (e) {
        throw new Error(e);
    }
    const sodium = _sodium;
    const curve = sk.substring(0, 2);
    if (![54, 55, 88, 98].includes(sk.length)) {
        throw new Error('Invalid length for a key encoding');
    }
    const encrypted = sk.substring(2, 3) === 'e';
    if (curve === 'ed') {
        if (encrypted) {
            const esb = toBuffer(b58cdecode(sk, prefix.edesk));
            const salt = esb.slice(0, 8);
            const esm = esb.slice(8);
            if (!password) {
                throw new Error('No password was provided to decrypt the key');
            }
            const key = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
            const kp = sodium.crypto_sign_seed_keypair(sodium.crypto_secretbox_open_easy(esm, new Uint8Array(24), key));
            return {
                sk: b58cencode(kp.privateKey, prefix.edsk),
                pk: b58cencode(kp.publicKey, prefix.edpk),
                pkh: b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
            };
        }
        if (sk.length === 98) {
            return {
                sk,
                pk: b58cencode(b58cdecode(sk, prefix.edsk).slice(32), prefix.edpk),
                pkh: b58cencode(sodium.crypto_generichash(20, b58cdecode(sk, prefix.edsk).slice(32)), prefix.tz1),
            };
        }
        if (sk.length === 54) {
            // seed
            const s = b58cdecode(sk, prefix.edsk2);
            const kp = sodium.crypto_sign_seed_keypair(s);
            return {
                sk: b58cencode(kp.privateKey, prefix.edsk),
                pk: b58cencode(kp.publicKey, prefix.edpk),
                pkh: b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
            };
        }
    }
    console.error('Invalid prefix for a key encoding');
    return {
        sk: '',
        pk: '',
        pkh: '',
    };
});
/**
 * @description Generate a mnemonic
 * @returns {string} The generated mnemonic
 */
export const generateMnemonic = () => bip39GenerateMnemonic(256);
/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {string} address The address to check
 * @returns {boolean} Whether address is valid or not
 */
export const checkAddress = (address) => {
    try {
        b58cdecode(address, prefix.tz1);
        return true;
    }
    catch (e) {
        return false;
    }
};
/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {string} mnemonic The mnemonic seed
 * @param {string} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 * @example
 * crypto.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 */
export const generateKeys = (mnemonic, passphrase) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _sodium.ready;
    }
    catch (e) {
        throw new Error(e);
    }
    const sodium = _sodium;
    const s = yield mnemonicToSeed(mnemonic, passphrase).then((seed) => seed.slice(0, 32));
    const kp = sodium.crypto_sign_seed_keypair(toBuffer(s));
    return {
        mnemonic,
        passphrase,
        sk: b58cencode(kp.privateKey, prefix.edsk),
        pk: b58cencode(kp.publicKey, prefix.edpk),
        pkh: b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
});
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
export const sign = (bytes, sk, magicBytes, password = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _sodium.ready;
    }
    catch (e) {
        throw new Error(e);
    }
    const sodium = _sodium;
    if (sk.length === 54 || sk.length === 55) {
        try {
            ({ sk } = yield extractKeys(sk, password));
        }
        catch (e) {
            throw new Error(e);
        }
    }
    let bb = hex2buf(bytes);
    if (typeof magicBytes !== 'undefined') {
        bb = mergebuf(magicBytes, bb);
    }
    const sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, bb), b58cdecode(sk, prefix.edsk), 'uint8array');
    const prefixSig = b58cencode(sig, prefix.edsig);
    const signatureBuffer = toBuffer(sig);
    const sbytes = bytes + buf2hex(signatureBuffer);
    return {
        bytes,
        magicBytes: magicBytes ? buf2hex(toBuffer(magicBytes)) : '',
        sig: b58cencode(sig, prefix.sig),
        prefixSig,
        sbytes,
    };
});
/**
 * @description Verify signed bytes
 * @param {String} bytes The signed bytes
 * @param {String} sig The signature of the signed bytes
 * @param {String} pk The public key
 * @returns {Boolean} Whether the signed bytes are valid
 */
export const verify = (bytes, sig, pk) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _sodium.ready;
    }
    catch (e) {
        throw new Error(e);
    }
    const sodium = _sodium;
    const bytesBuffer = toBuffer(hex2buf(bytes));
    const signature = b58cdecode(sig, prefix.sig);
    return sodium.crypto_sign_verify_detached(signature, sodium.crypto_generichash(32, bytesBuffer), b58cdecode(pk, prefix.edpk));
});
export default {
    extractKeys,
    generateKeys,
    checkAddress,
    generateMnemonic,
    sign,
    verify,
};
