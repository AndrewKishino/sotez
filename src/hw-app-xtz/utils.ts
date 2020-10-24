import bs58check from 'bs58check';
import blake2b from 'blake2b';

/**
 * @description Split path utility
 * @param {string} path The ledger path
 * @returns {number[]} Array of path segments
 */
export function splitPath(path: string): number[] {
  const result: any[] = [];
  const components = path.split('/');
  components.forEach((element) => {
    let number = parseInt(element, 10);
    if (Number.isNaN(number)) {
      return;
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}

const pkB58Prefix = (curve: number) => {
  switch (curve) {
    // edpk
    case 0x00:
      return Buffer.of(13, 15, 37, 217);
    // sppk
    case 0x01:
      return Buffer.of(3, 254, 226, 86);
    // p2pk
    case 0x02:
      return Buffer.of(3, 178, 139, 127);
    default:
      return Buffer.of(0);
  }
};

const pkhB58Prefix = (curve: number) => {
  switch (curve) {
    // tz1
    case 0x00:
      return Buffer.of(6, 161, 159);
    // tz2
    case 0x01:
      return Buffer.of(6, 161, 161);
    // tz3
    case 0x02:
      return Buffer.of(6, 161, 164);
    default:
      return Buffer.of(0);
  }
};

// converts uncompressed ledger key to standard tezos binary
// representation, with curve marker first byte (as for michelson key
// type)
const compressPublicKey = (publicKey: Buffer, curve: number) => {
  switch (curve) {
    // Ed25519
    case 0x00:
      publicKey = publicKey.slice(0);
      publicKey[0] = curve;
      return publicKey;
    // SECP256K1, SECP256R1
    case 0x01:
    case 0x02:
      return Buffer.concat([
        Buffer.of(curve, 0x02 + (publicKey[64] & 0x01)),
        publicKey.slice(1, 33),
      ]);
    default:
      return Buffer.of(0);
  }
};

export const encodePublicKey = (publicKey: Buffer, curve: number) => {
  publicKey = compressPublicKey(publicKey, curve);
  return {
    publicKey: publicKeyToString(publicKey),
    address: hashPublicKeyToString(publicKey),
  };
};

const publicKeyToString = (publicKey: Buffer) => {
  const curve = publicKey[0];
  const key = publicKey.slice(1);
  return bs58check.encode(Buffer.concat([pkB58Prefix(curve), key]));
};

const keyHashSize = 20;

const hashPublicKeyToString = (publicKey: Buffer) => {
  const curve = publicKey[0];
  const key = publicKey.slice(1);
  let hash = blake2b(keyHashSize);
  hash.update(key);
  hash.digest((hash = Buffer.alloc(keyHashSize)));
  return bs58check.encode(Buffer.concat([pkhB58Prefix(curve), hash]));
};
