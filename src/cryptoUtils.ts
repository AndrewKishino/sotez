import { hash } from '@stablelib/blake2b';
import {
  generateKeyPairFromSeed,
  extractPublicKeyFromSecretKey,
  sign as ed25519Sign,
  verify as ed25519Verify,
} from '@stablelib/ed25519';
import { randomBytes } from '@stablelib/random';
import { openSecretBox, secretBox } from '@stablelib/nacl';
import {
  generateMnemonic as bip39GenerateMnemonic,
  mnemonicToSeed,
} from 'bip39';
import pbkdf2 from 'pbkdf2';
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
  const curve = sk.substring(0, 2);

  if (![54, 55, 88, 98].includes(sk.length)) {
    throw new Error('Invalid length for a key encoding');
  }

  const encrypted = sk.substring(2, 3) === 'e';

  let secretKey = b58cdecode(sk, prefix[`${curve}${encrypted ? 'e' : ''}sk`]);

  let salt;
  if (encrypted) {
    salt = secretKey.slice(0, 8);
    const encryptedSk = secretKey.slice(8);

    if (!passphrase) {
      throw new Error('No passphrase was provided to decrypt the key');
    }

    const key = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');
    secretKey = openSecretBox(
      new Uint8Array(key),
      new Uint8Array(24),
      encryptedSk,
    ) as Uint8Array;
  }

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
    if (secretKey.length === 64) {
      publicKey = extractPublicKeyFromSecretKey(secretKey);
    } else {
      const { publicKey: publicKeyDerived, secretKey: privateKey } =
        generateKeyPairFromSeed(secretKey);
      publicKey = publicKeyDerived;
      secretKey = privateKey;

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
      pkh: b58cencode(hash(publicKey, 20), prefix.tz1),
    };
  }

  if (curve === 'sp') {
    const keyPair = new elliptic.ec('secp256k1').keyFromPrivate(secretKey);
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
      pkh: b58cencode(hash(new Uint8Array(publicKey), 20), prefix.tz2),
    };
  }

  if (curve === 'p2') {
    const keyPair = new elliptic.ec('p256').keyFromPrivate(secretKey);
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
      pkh: b58cencode(hash(publicKey, 20), prefix.tz3),
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
  const s = await mnemonicToSeed(mnemonic, passphrase).then((seed) =>
    seed.slice(0, 32),
  );
  const kp = generateKeyPairFromSeed(new Uint8Array(s));
  return {
    mnemonic,
    passphrase,
    sk: b58cencode(kp.secretKey, prefix.edsk),
    pk: b58cencode(kp.publicKey, prefix.edpk),
    pkh: b58cencode(hash(kp.publicKey, 20), prefix.tz1),
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
  salt: Uint8Array = randomBytes(8),
) => {
  if (!passphrase) {
    throw new Error('passphrase is require when encrypting a secret key');
  }

  const curve = key.substring(0, 2);

  let secretKey = b58cdecode(key, prefix[`${curve}sk`]);

  if (curve === 'ed') {
    if (secretKey.length !== 64) {
      // seed
      ({ secretKey } = generateKeyPairFromSeed(secretKey));
    }

    secretKey = secretKey.slice(0, 32);
  }

  const encryptionKey = pbkdf2.pbkdf2Sync(
    passphrase,
    salt,
    32768,
    32,
    'sha512',
  );

  const encryptedSk = secretBox(
    new Uint8Array(encryptionKey),
    new Uint8Array(24),
    secretKey,
  );

  return b58cencode(mergebuf(salt, encryptedSk), prefix[`${curve}esk`]);
};

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
export const sign = async (
  bytes: string,
  sk: string,
  magicBytes?: Uint8Array,
  password = '',
): Promise<Signed> => {
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
    constructedKey = openSecretBox(
      new Uint8Array(key),
      new Uint8Array(24),
      encryptedSk,
    ) as Uint8Array;
  }

  let secretKey = constructedKey;

  let bb = hex2buf(bytes);
  if (typeof magicBytes !== 'undefined') {
    bb = mergebuf(magicBytes, bb);
  }

  const bytesHash = hash(bb, 32);

  if (curve === 'ed') {
    if (constructedKey.length !== 64) {
      const { secretKey: privateKey } = generateKeyPairFromSeed(secretKey);
      secretKey = privateKey;
    }
    const signature = ed25519Sign(secretKey, bytesHash);
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
  if (!pk) {
    throw new Error('Cannot verify without a public key');
  }

  const curve = pk.substring(0, 2);
  const publicKey = b58cdecode(pk, prefix[`${curve}pk`]);

  if (sig.substring(0, 3) !== 'sig') {
    if (curve !== sig.substring(0, 2)) {
      // 'sp', 'p2' 'ed'
      throw new Error('Signature and public key curves mismatch.');
    }
  }

  const bytesBuffer = hash(hex2buf(bytes), 32);
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
      return ed25519Verify(publicKey, bytesBuffer, signature);
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
