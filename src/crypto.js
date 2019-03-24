// @flow
import bip39 from 'bip39';
import _sodium from 'libsodium-wrappers';
import utility from './utility';
import { prefix } from './constants';

import type {
  Crypto,
  Keys,
  KeysMnemonicPassphrase,
  Signed,
} from './types';

// TODO: Add p256 and secp256k1 cryptographay
const crypto: Crypto = {};
/**
 * @description Extract key pairs from a secret key
 * @param {Object} sk The secret key to extract key pairs from
 * @returns {Promise} The extracted key pairs
 * @example
 * crypto.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
 *   .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh))
 */
crypto.extractKeys = async (sk: string): Promise<Keys> => { // eslint-disable-line
  try {
    await _sodium.ready;
  } catch (e) {
    throw new Error(e);
  }

  const sodium = _sodium;
  const pref = sk.substr(0, 4);
  switch (pref) {
    case 'edsk':
      if (sk.length === 98) {
        return {
          pk: utility.b58cencode(utility.b58cdecode(sk, prefix.edsk).slice(32), prefix.edpk),
          pkh: utility.b58cencode(sodium.crypto_generichash(20, utility.b58cdecode(sk, prefix.edsk).slice(32)), prefix.tz1),
          sk,
        };
      }
      if (sk.length === 54) { // seed
        const s = utility.b58cdecode(sk, prefix.edsk2);
        const kp = sodium.crypto_sign_seed_keypair(s);
        return {
          sk: utility.b58cencode(kp.privateKey, prefix.edsk),
          pk: utility.b58cencode(kp.publicKey, prefix.edpk),
          pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
        };
      }
      break;
    default:
      return {
        sk: '',
        pk: '',
        pkh: '',
      };
  }
  return {
    sk: '',
    pk: '',
    pkh: '',
  };
};

/**
 * @description Generate a mnemonic
 * @returns {String} The generated mnemonic
 */
crypto.generateMnemonic = (): string => bip39.generateMnemonic(160);

/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {String} address The address to check
 * @returns {Boolean} Whether address is valid or not
 */
crypto.checkAddress = (address: string): boolean => {
  try {
    utility.b58cdecode(address, prefix.tz1);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {String} mnemonic The mnemonic seed
 * @param {String} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 * @example
 * crypto.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh))
 */
crypto.generateKeys = async (mnemonic: string, passphrase: string): Promise<KeysMnemonicPassphrase> => {
  try {
    await _sodium.ready;
  } catch (e) {
    throw new Error(e);
  }

  const sodium = _sodium;
  const s = bip39.mnemonicToSeed(mnemonic, passphrase).slice(0, 32);
  const kp = sodium.crypto_sign_seed_keypair(s);
  return {
    mnemonic,
    passphrase,
    sk: utility.b58cencode(kp.privateKey, prefix.edsk),
    pk: utility.b58cencode(kp.publicKey, prefix.edpk),
    pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

/**
 * @description Sign bytes
 * @param {String} bytes The bytes to sign
 * @param {String} sk The secret key to sign the bytes with
 * @param {Object} wm The watermark bytes
 * @returns {Promise} The signed bytes
 * @example
 * import { watermark } from 'sotez';
 *
 * crypto.sign(opbytes, keys.sk, watermark.generic)
 *   .then(({ bytes, sig, edsig, sbytes }) => console.log(bytes, sig, edsig, sbytes))
 */
crypto.sign = async (bytes: string, sk: string, wm: Uint8Array): Promise<Signed> => {
  try {
    await _sodium.ready;
  } catch (e) {
    throw new Error(e);
  }

  const sodium = _sodium;
  if (sk.length === 54) {
    try {
      ({ sk } = await crypto.extractKeys(sk));
    } catch (e) {
      throw new Error(e);
    }
  }

  let bb = utility.hex2buf(bytes);
  if (typeof wm !== 'undefined') {
    bb = utility.mergebuf(wm, bb);
  }
  const sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, bb), utility.b58cdecode(sk, prefix.edsk), 'uint8array');
  const edsig = utility.b58cencode(sig, prefix.edsig);
  const sbytes = bytes + utility.buf2hex(sig);
  return {
    bytes,
    sig,
    edsig,
    sbytes,
  };
};

/**
 * @description Verify signed bytes
 * @param {String} bytes The signed bytes
 * @param {String} sig The signature of the signed bytes
 * @param {String} pk The public key
 * @returns {Boolean} Whether the signed bytes are valid
 */
crypto.verify = async (bytes: string, sig: string, pk: string): Promise<number> => {
  try {
    await _sodium.ready;
  } catch (e) {
    throw new Error(e);
  }

  const sodium = _sodium;
  return sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk));
};

export default crypto;
