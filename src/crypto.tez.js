const library = require('./library.tez');
const utility = require('./utility.tez');
const prefix = require('./prefix.tez');

module.exports = {
  generateMnemonic() {
    return library.bip39.generateMnemonic(160);
  },
  checkAddress(a) {
    try {
      utility.b58cdecode(a, prefix.tz1);
      return true;
    } catch (e) {
      return false;
    }
  },
  generateKeysNoSeed() {
    const kp = library.sodium.crypto_sign_keypair();
    return {
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeysSalted(m, p) {
    const ss = Math.random().toString(36).slice(2);
    const pp = library.pbkdf2.pbkdf2Sync(p, ss, 0, 32, 'sha512').toString();
    const s = library.bip39.mnemonicToSeed(m, pp).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      salt: ss,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeys(m, p) {
    const s = library.bip39.mnemonicToSeed(m, p).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeysFromSeedMulti(m, p, n) {
    n /= (256 ^ 2);
    const s = library.bip39.mnemonicToSeed(m, library.pbkdf2.pbkdf2Sync(p, n.toString(36).slice(2), 0, 32, 'sha512').toString()).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      n,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  sign(bytes, sk) {
    const sig = library.sodium.crypto_sign_detached(utility.hex2buf(bytes), utility.b58cdecode(sk, prefix.edsk), 'uint8array');
    const edsig = utility.b58cencode(sig, prefix.edsig);
    const sbytes = bytes + utility.buf2hex(sig);
    return {
      bytes,
      sig,
      edsig,
      sbytes,
    };
  },
  verify(bytes, sig, pk) {
    return library.sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk));
  },
};
