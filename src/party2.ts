import { Ed25519Party2, Ed25519Party2Share } from '@kzen-networks/thresh-sig';
import toBuffer from 'typedarray-to-buffer';
import * as sodium from 'libsodium-wrappers';
import utility from './utility';
import { prefix } from './constants';

export default class Party2 {
  _p2: Ed25519Party2;
  _p2Share: Ed25519Party2Share | undefined;
  ready: Promise<void>;

  constructor(p2: Ed25519Party2, p2Share?: Ed25519Party2Share) {
    this._p2 = p2;
    this._p2Share = p2Share;
    this.ready = this.initialize();
  }

  initialize = async (): Promise<void> => {
    await sodium.ready;
    if (!this._p2Share) {
      this._p2Share = await this._p2.generateKey();
    }
  };

  /**
     * @memberof Party2
     * @description Returns party two's the secret share
     * @returns {Ed25519Party2Share} Party two's secret share
     */
  secretShare = (): Ed25519Party2Share => this._p2Share as Ed25519Party2Share;

  /**
     * @memberof Party2
     * @description Returns the public key
     * @returns {String} The shared (aggregated) public key associated with the secret share
     */
  publicKey = (): string => {
    const publicKey = (this._p2Share as Ed25519Party2Share).getAggregatedPublicKey().apk.bytes_str;
    return utility.b58cencode(new Uint8Array(Buffer.from(publicKey, 'hex')), prefix.edpk);
  };

  /**
     * @memberof Party2
     * @description Returns public key hash for this secret share
     * @returns {String} The public key hash for this secret share
     */
  publicKeyHash = (): string => {
    const publicKey = new Uint8Array(Buffer.from(this._p2Share.getAggregatedPublicKey().apk.bytes_str, 'hex'));
    return utility.b58cencode(sodium.crypto_generichash(20, publicKey), prefix.tz1);
  };

  sign = async (bytes: string, watermark: Uint8Array) => {
    let bb = utility.hex2buf(bytes);
    if (typeof watermark !== 'undefined') {
      bb = utility.mergebuf(watermark, bb);
    }

    const bytesHash = toBuffer(sodium.crypto_generichash(32, bb));

    if (!this._p2 || !this._p2Share) {
      throw new Error('Cannot sign operations without intiialized Ed25519 party2 or secret share.');
    }

    const signature = new Uint8Array(
      (await this._p2.sign(bytesHash, this._p2Share))
        .toBuffer(),
    );

    const signatureBuffer = toBuffer(signature);
    const sbytes = bytes + utility.buf2hex(signatureBuffer);

    return {
      bytes,
      sig: utility.b58cencode(signature, prefix.sig),
      prefixSig: utility.b58cencode(signature, prefix.edsig),
      sbytes,
    };
  }
}
