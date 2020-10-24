import { splitPath, encodePublicKey } from './utils';

interface GetAddressResult {
  publicKey: string;
  address: string;
}

interface SignOperationResult {
  signature: string;
}

interface GetVersionResult {
  major: number;
  minor: number;
  patch: number;
  bakingApp: boolean;
}

const TezosCurves = {
  ED25519: 0x00,
  SECP256K1: 0x01,
  SECP256R1: 0x02,
};

/**
 * Tezos API
 *
 * @example
 * import Tezos from '@ledgerhq/hw-app-xtz';
 * const tez = new Tezos(transport)
 */
export default class Tezos {
  transport: any;

  constructor(transport: any) {
    this.transport = transport;
    transport.decorateAppAPIMethods(
      this,
      ['getAddress', 'signOperation', 'getVersion'],
      'XTZ',
    );
  }

  /**
   * @description Get Tezos address for a given BIP 32 path.
   * @param {string} path a path in BIP 32 format, must begin with 44'/1729'
   * @param {boolean} [boolDisplay=false] optionally enable or not the display
   * @param {number} [curve=0x00] optionally enable or not the chaincode request
   * @param {number} [apdu] to use a custom apdu. This should currently only be unset (which will choose
   *   an appropriate APDU based on the boolDisplay parameter), or else set to 0x0A
   *   for the special "display" APDU which uses the alternate copy "Your Key"
   * @returns {Promise} An object with a publicKey
   * @example
   * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
   */
  async getAddress(
    path: string,
    boolDisplay = false,
    curve = TezosCurves.ED25519,
    apdu?: number,
  ): Promise<GetAddressResult> {
    const cla = 0x80;
    if (!apdu) {
      if (boolDisplay) {
        apdu = 0x03;
      } else {
        apdu = 0x02;
      }
    }
    const p1 = 0;
    const p2 = curve;

    const paths = splitPath(path);
    const buffer = Buffer.alloc(1 + paths.length * 4);
    buffer[0] = paths.length;
    paths.forEach((element, index) => {
      buffer.writeUInt32BE(element, 1 + 4 * index);
    });

    const payload = await this.transport.send(cla, apdu, p1, p2, buffer);

    const publicKeyLength = payload[0];
    const publicKey = payload.slice(1, 1 + publicKeyLength);
    return encodePublicKey(publicKey, curve);
  }

  async sign(
    path: string,
    rawTxHex: string,
    curve = TezosCurves.ED25519,
    adpu: number,
  ): Promise<SignOperationResult> {
    const paths = splitPath(path);
    let offset = 0;
    const rawTx = Buffer.from(rawTxHex, 'hex');
    const toSend = [];

    const buffer = Buffer.alloc(paths.length * 4 + 1);
    buffer[0] = paths.length;
    paths.forEach((element, index) => {
      buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    toSend.push(buffer);

    while (offset !== rawTx.length) {
      const maxChunkSize = 230;
      let chunkSize;
      if (offset + maxChunkSize >= rawTx.length) {
        chunkSize = rawTx.length - offset;
      } else {
        chunkSize = maxChunkSize;
      }
      const buff = Buffer.alloc(chunkSize);
      rawTx.copy(buff, 0, offset, offset + chunkSize);
      toSend.push(buff);
      offset += chunkSize;
    }

    let response;
    for (let i = 0; i < toSend.length; i++) {
      const data = toSend[i];
      let code = 0x01;
      if (i === 0) {
        code = 0x00;
      } else if (i === toSend.length - 1) {
        code = 0x81;
      }
      // eslint-disable-next-line no-await-in-loop
      response = await this.transport.send(0x80, adpu, code, curve, data);
    }

    let signature;
    if (curve === TezosCurves.ED25519) {
      signature = response.slice(0, response.length - 2).toString('hex');
    } else {
      const signatureBuffer = Buffer.alloc(64);
      signatureBuffer.fill(0);
      const r_val = signatureBuffer.subarray(0, 32);
      const s_val = signatureBuffer.subarray(32, 64);
      let idx = 0;
      const frameType = response.readUInt8(idx++);
      if (frameType !== 0x31 && frameType !== 0x30) {
        throw new Error('Cannot parse ledger response.');
      }
      if (response.readUInt8(idx++) + 4 !== response.length) {
        throw new Error('Cannot parse ledger response.');
      }
      if (response.readUInt8(idx++) !== 0x02) {
        throw new Error('Cannot parse ledger response.');
      }
      let r_length = response.readUInt8(idx++);
      if (r_length > 32) {
        idx += r_length - 32;
        r_length = 32;
      }
      response.copy(r_val, 32 - r_length, idx, idx + r_length);
      idx += r_length;
      if (response.readUInt8(idx++) !== 0x02) {
        throw new Error('Cannot parse ledger response.');
      }
      let s_length = response.readUInt8(idx++);
      if (s_length > 32) {
        idx += s_length - 32;
        s_length = 32;
      }
      response.copy(s_val, 32 - s_length, idx, idx + s_length);
      idx += s_length;
      if (idx !== response.length - 2) {
        throw new Error('Cannot parse ledger response.');
      }
      signature = signatureBuffer.toString('hex');
    }
    return { signature };
  }

  signOperation(
    path: string,
    rawTxHex: string,
    curve = TezosCurves.ED25519,
  ): Promise<SignOperationResult> {
    return this.sign(path, rawTxHex, curve, 0x04);
  }

  signHash(
    path: string,
    rawTxHex: string,
    curve = TezosCurves.ED25519,
  ): Promise<SignOperationResult> {
    return this.sign(path, rawTxHex, curve, 0x05);
  }

  async getVersion(): Promise<GetVersionResult> {
    const [appFlag, major, minor, patch] = await this.transport.send(
      0x80,
      0x00,
      0x00,
      0x00,
      Buffer.alloc(0),
    );
    const bakingApp = appFlag === 1;
    return { major, minor, patch, bakingApp };
  }
}
