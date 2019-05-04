// @flow
import bs58check from 'bs58check';
import blake2b from 'blake2b';

type Defer<T> = {
  promise: Promise<T>,
  resolve: T => void,
  reject: any => void
};

export function defer<T>(): Defer<T> {
  let resolve;
  let reject;
  const promise = new Promise((success, failure) => {
    resolve = success;
    reject = failure;
  });
  if (!resolve || !reject) throw new Error('defer() error'); // this never happens and is just to make flow happy
  return { promise, resolve, reject };
}

// TODO use bip32-path library
export function splitPath(path: string): number[] {
  const result = [];
  const components = path.split('/');
  components.forEach((element) => {
    let number = parseInt(element, 10);
    if (Number.isNaN(number)) {
      return; // FIXME shouldn't it throws instead?
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}

// TODO use async await

export function eachSeries<A>(arr: A[], fun: A => Promise<*>): Promise<*> {
  return arr.reduce((p, e) => p.then(() => fun(e)), Promise.resolve());
}

export function foreach<T, A>(
  arr: T[],
  callback: (T, number) => Promise<A>,
): Promise<A[]> {
  function iterate(index, array, result) {
    if (index >= array.length) {
      return result;
    }

    return callback(array[index], index).then((res) => {
      result.push(res);
      return iterate(index + 1, array, result);
    });
  }
  return Promise.resolve().then(() => iterate(0, arr, []));
}

export function doIf(
  condition: boolean,
  callback: () => any | Promise<any>,
): Promise<void> {
  return Promise.resolve().then(() => { // eslint-disable-line
    if (condition) {
      return callback();
    }
  });
}

export function asyncWhile<T>(
  predicate: () => boolean,
  callback: () => Promise<T>,
): Promise<Array<T>> {
  function iterate(result) {
    if (!predicate()) {
      return result;
    }

    return callback().then((res) => {
      result.push(res);
      return iterate(result);
    });
  }
  return Promise.resolve([]).then(iterate);
}

const pkB58Prefix = (curve) => {
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

const pkhB58Prefix = (curve) => {
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
        Buffer.of(
          curve,
          0x02 + (publicKey[64] & 0x01),
        ),
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

// remaining functions operate on tezos compressed key w/ curve marker

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
  hash.digest(hash = Buffer.alloc(keyHashSize));
  return bs58check.encode(Buffer.concat([pkhB58Prefix(curve), hash]));
};
