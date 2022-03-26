import {
  generateMnemonic as bip39GenerateMnemonic,
  mnemonicToSeed,
} from 'bip39';
import pbkdf2 from 'pbkdf2';
import sodium from 'libsodium-wrappers-sumo';
import elliptic from 'elliptic';
import { b58cdecode, b58cencode, hex2buf, mergebuf, buf2hex } from './utility';
import { prefix } from './constants';

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
export const extractKeys = async (
  sk: string,
  passphrase = '',
): Promise<Keys> => {
  await sodium.ready;

  const curve = sk.substring(0, 2);

  if (![54, 55, 88, 98].includes(sk.length)) {
    throw new Error('Invalid length for a key encoding');
  }

  const encrypted = sk.substring(2, 3) === 'e';

  let constructedKey = b58cdecode(
    sk,
    prefix[`${curve}${encrypted ? 'e' : ''}sk`],
  );

  let salt;
  if (encrypted) {
    salt = constructedKey.slice(0, 8);
    const encryptedSk = constructedKey.slice(8);

    if (!passphrase) {
      throw new Error('No passphrase was provided to decrypt the key');
    }

    const key = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');
    constructedKey = sodium.crypto_secretbox_open_easy(
      new Uint8Array(encryptedSk),
      new Uint8Array(24),
      new Uint8Array(key),
    );
  }

  let secretKey = new Uint8Array(constructedKey);

  let privateKeys: { sk: string; esk?: string; salt?: Uint8Array } = {
    sk,
  };

  if (encrypted) {
    privateKeys = {
      esk: sk,
      sk: b58cencode(secretKey, prefix[`${curve}sk`]),
      salt,
    };
  }

  if (curve === 'ed') {
    let publicKey;
    if (constructedKey.length === 64) {
      publicKey = new Uint8Array(
        sodium.crypto_sign_ed25519_sk_to_pk(secretKey),
      );
    } else {
      const { publicKey: publicKeyDerived, privateKey } =
        sodium.crypto_sign_seed_keypair(secretKey, 'uint8array');
      publicKey = new Uint8Array(publicKeyDerived);
      secretKey = new Uint8Array(privateKey);

      if (encrypted) {
        privateKeys = {
          esk: sk,
          sk: b58cencode(secretKey, prefix[`${curve}sk`]),
          salt,
        };
      }
    }

    return {
      ...privateKeys,
      pk: b58cencode(publicKey, prefix.edpk),
      pkh: b58cencode(sodium.crypto_generichash(20, publicKey), prefix.tz1),
    };
  }

  if (curve === 'sp') {
    const keyPair = new elliptic.ec('secp256k1').keyFromPrivate(constructedKey);
    const prefixVal = keyPair.getPublic().getY().toArray()[31] % 2 ? 3 : 2;
    const pad = new Array(32).fill(0);
    const publicKey = new Uint8Array(
      [prefixVal].concat(
        pad.concat(keyPair.getPublic().getX().toArray()).slice(-32),
      ),
    );

    return {
      ...privateKeys,
      pk: b58cencode(publicKey, prefix.sppk),
      pkh: b58cencode(
        sodium.crypto_generichash(20, new Uint8Array(publicKey)),
        prefix.tz2,
      ),
    };
  }

  if (curve === 'p2') {
    const keyPair = new elliptic.ec('p256').keyFromPrivate(constructedKey);
    const prefixVal = keyPair.getPublic().getY().toArray()[31] % 2 ? 3 : 2;
    const pad = new Array(32).fill(0);
    const publicKey = new Uint8Array(
      [prefixVal].concat(
        pad.concat(keyPair.getPublic().getX().toArray()).slice(-32),
      ),
    );

    return {
      ...privateKeys,
      pk: b58cencode(publicKey, prefix.p2pk),
      pkh: b58cencode(
        sodium.crypto_generichash(20, new Uint8Array(publicKey)),
        prefix.tz3,
      ),
    };
  }

  throw new Error('Invalid prefix for a key encoding');
};

/**
 * @description Generate a mnemonic
 * @returns {string} The 15 word generated mnemonic
 */
export const generateMnemonic = (): string => bip39GenerateMnemonic(160);

/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {string} address The address to check
 * @returns {boolean} Whether address is valid or not
 */
export const checkAddress = (address: string): boolean => {
  try {
    b58cdecode(address, prefix.tz1);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {string} mnemonic The mnemonic seed
 * @param {string} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 * @example
 * cryptoUtils.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
 *   .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
 */
export const generateKeys = async (
  mnemonic: string,
  passphrase?: string,
): Promise<KeysMnemonicPassphrase> => {
  await sodium.ready;
  const s = await mnemonicToSeed(mnemonic, passphrase).then((seed) =>
    seed.slice(0, 32),
  );
  const kp = sodium.crypto_sign_seed_keypair(new Uint8Array(s));
  return {
    mnemonic,
    passphrase,
    sk: b58cencode(kp.privateKey, prefix.edsk),
    pk: b58cencode(kp.publicKey, prefix.edpk),
    pkh: b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

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
export const encryptSecretKey = (
  key: string,
  passphrase: string,
  salt: Uint8Array = sodium.randombytes_buf(8),
) => {
  if (!passphrase) {
    throw new Error('passphrase is require when encrypting a secret key');
  }

  const curve = key.substring(0, 2);

  let secretKey = b58cdecode(key, prefix[`${curve}sk`]);

  if (curve === 'ed') {
    if (secretKey.length !== 64) {
      // seed
      const { privateKey } = sodium.crypto_sign_seed_keypair(
        secretKey,
        'uint8array',
      );
      secretKey = new Uint8Array(privateKey);
    }
  }

  if (curve === 'ed') {
    secretKey = sodium.crypto_sign_ed25519_sk_to_seed(secretKey, 'uint8array');
  }

  const encryptionKey = pbkdf2.pbkdf2Sync(
    passphrase,
    salt,
    32768,
    32,
    'sha512',
  );

  const encryptedSk = sodium.crypto_secretbox_easy(
    secretKey,
    new Uint8Array(24),
    new Uint8Array(encryptionKey),
  );

  return b58cencode(mergebuf(salt, encryptedSk), prefix[`${curve}esk`]);
};

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
 * cryptoUtils.sign(opbytes, keys.sk, magicBytesMap.generic)
 *   .then(({ bytes, magicBytes, sig, prefixSig, sbytes }) => console.log(bytes, magicBytes, sig, prefixSig, sbytes));
 */
export const sign = async (
  bytes: string,
  sk: string,
  magicBytes?: Uint8Array,
  password = '',
): Promise<Signed> => {
  await sodium.ready;

  const curve = sk.substring(0, 2);

  if (![54, 55, 88, 98].includes(sk.length)) {
    throw new Error('Invalid length for a key encoding');
  }

  const encrypted = sk.substring(2, 3) === 'e';

  let constructedKey = b58cdecode(
    sk,
    prefix[`${curve}${encrypted ? 'e' : ''}sk`],
  );

  if (encrypted) {
    const salt = constructedKey.slice(0, 8);
    const encryptedSk = constructedKey.slice(8);

    if (!password) {
      throw new Error('No password was provided to decrypt the key');
    }

    const key = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
    constructedKey = sodium.crypto_secretbox_open_easy(
      new Uint8Array(encryptedSk),
      new Uint8Array(24),
      new Uint8Array(key),
    );
  }

  let secretKey = new Uint8Array(constructedKey);

  let bb = hex2buf(bytes);
  if (typeof magicBytes !== 'undefined') {
    bb = mergebuf(magicBytes, bb);
  }

  const bytesHash = new Uint8Array(sodium.crypto_generichash(32, bb));

  if (curve === 'ed') {
    if (constructedKey.length !== 64) {
      const { privateKey } = sodium.crypto_sign_seed_keypair(
        secretKey,
        'uint8array',
      );
      secretKey = new Uint8Array(privateKey);
    }
    const signature = sodium.crypto_sign_detached(bytesHash, secretKey);
    const sbytes = bytes + buf2hex(signature);

    return {
      bytes,
      magicBytes: magicBytes ? buf2hex(magicBytes) : '',
      sig: b58cencode(signature, prefix.sig),
      prefixSig: b58cencode(signature, prefix.edsig),
      sbytes,
    };
  }

  if (curve === 'sp') {
    const key = new elliptic.ec('secp256k1').keyFromPrivate(secretKey);
    const sig = key.sign(bytesHash, { canonical: true });
    const signature = new Uint8Array(
      sig.r.toArray(undefined, 32).concat(sig.s.toArray(undefined, 32)),
    );
    const sbytes = bytes + buf2hex(signature);

    return {
      bytes,
      magicBytes: magicBytes ? buf2hex(magicBytes) : '',
      sig: b58cencode(signature, prefix.sig),
      prefixSig: b58cencode(signature, prefix.spsig),
      sbytes,
    };
  }

  if (curve === 'p2') {
    const key = new elliptic.ec('p256').keyFromPrivate(secretKey);
    const sig = key.sign(bytesHash, { canonical: true });
    const signature = new Uint8Array(
      sig.r.toArray(undefined, 32).concat(sig.s.toArray(undefined, 32)),
    );
    const sbytes = bytes + buf2hex(signature);

    return {
      bytes,
      magicBytes: magicBytes ? buf2hex(magicBytes) : '',
      sig: b58cencode(signature, prefix.sig),
      prefixSig: b58cencode(signature, prefix.p2sig),
      sbytes,
    };
  }

  throw new Error('Provided curve not supported');
};

/**
 * @description Verify signed bytes
 * @param {string} bytes The signed bytes
 * @param {string} sig The signature of the signed bytes
 * @param {string} pk The public key
 * @returns {boolean} Whether the signed bytes are valid
 */
export const verify = async (
  bytes: string,
  sig: string,
  pk: string,
): Promise<boolean> => {
  await sodium.ready;
  if (!pk) {
    throw new Error('Cannot verify without a public key');
  }

  const curve = pk.substring(0, 2);
  const publicKey = new Uint8Array(b58cdecode(pk, prefix[`${curve}pk`]));

  if (sig.substring(0, 3) !== 'sig') {
    if (curve !== sig.substring(0, 2)) {
      // 'sp', 'p2' 'ed'
      throw new Error('Signature and public key curves mismatch.');
    }
  }

  const bytesBuffer = sodium.crypto_generichash(32, hex2buf(bytes));
  let signature;
  if (sig.substring(0, 3) === 'sig') {
    signature = b58cdecode(sig, prefix.sig);
  } else if (sig.substring(0, 5) === `${curve}sig`) {
    signature = b58cdecode(sig, prefix[`${curve}sig`]);
  } else {
    throw new Error(`Invalid signature provided: ${sig}`);
  }

  if (curve === 'ed') {
    try {
      return sodium.crypto_sign_verify_detached(
        new Uint8Array(signature),
        new Uint8Array(bytesBuffer),
        publicKey,
      );
    } catch (e) {
      return false;
    }
  } else if (curve === 'sp') {
    const key = new elliptic.ec('secp256k1').keyFromPublic(publicKey);
    const formattedSig = buf2hex(signature);
    const match = formattedSig.match(/([a-f\d]{64})/gi);
    if (match) {
      try {
        const [r, s] = match;
        return key.verify(bytesBuffer, { r, s });
      } catch (e) {
        return false;
      }
    }
    return false;
  } else if (curve === 'p2') {
    const key = new elliptic.ec('p256').keyFromPublic(publicKey);
    const formattedSig = buf2hex(signature);
    const match = formattedSig.match(/([a-f\d]{64})/gi);
    if (match) {
      try {
        const [r, s] = match;
        return key.verify(bytesBuffer, { r, s });
      } catch (e) {
        return false;
      }
    }
    return false;
  } else {
    throw new Error(`Curve '${curve}' not supported`);
  }
};

export default {
  extractKeys,
  encryptSecretKey,
  generateKeys,
  checkAddress,
  generateMnemonic,
  sign,
  verify,
};
