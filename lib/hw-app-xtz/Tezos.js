import { splitPath, foreach, encodePublicKey } from './utils';
/**
 * Tezos API
 *
 * @example
 * import Tezos from '@ledgerhq/hw-app-xtz';
 * const tez = new Tezos(transport)
 */
export default class Tezos {
    constructor(transport) {
        this.transport = transport;
        transport.decorateAppAPIMethods(this, ['getAddress', 'signOperation', 'getVersion'], 'XTZ');
    }
    /**
     * get Tezos public key and address (key hash) for a given BIP 32 path.
     * @param path a path in BIP 32 format, must begin with 44'/1729'
     * @option boolDisplay optionally enable or not the display
     * @return an object with a publicKey
     * @example
     * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
     */
    getAddress(path, boolDisplay, curve = 0x00) {
        const paths = splitPath(path);
        const buffer = Buffer.alloc(paths.length * 4 + 1);
        buffer[0] = paths.length;
        paths.forEach((element, index) => {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        return this.transport
            .send(0x80, boolDisplay ? 0x03 : 0x02, 0, curve, buffer)
            .then((response) => {
            const publicKeyLength = response[0];
            const publicKey = response.slice(1, 1 + publicKeyLength);
            return encodePublicKey(publicKey, curve);
        });
    }
    signOperation(path, rawTxHex, curve = 0x00) {
        const paths = splitPath(path);
        let offset = 0;
        const rawTx = Buffer.from(rawTxHex, 'hex');
        const toSend = [];
        let response;
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
            }
            else {
                chunkSize = maxChunkSize;
            }
            const buffer = Buffer.alloc(chunkSize);
            rawTx.copy(buffer, 0, offset, offset + chunkSize);
            toSend.push(buffer);
            offset += chunkSize;
        }
        return foreach(toSend, (data, i) => {
            let code = 0x01;
            if (i === 0) {
                code = 0x00;
            }
            else if (i === toSend.length - 1) {
                code = 0x81;
            }
            return this.transport
                .send(0x80, 0x04, code, curve, data)
                .then((apduResponse) => {
                response = apduResponse;
            });
        }).then(() => {
            const signature = response.slice(0, -2).toString('hex');
            return { signature };
        });
    }
    getVersion() {
        return this.transport
            .send(0x80, 0x00, 0x00, 0x00, Buffer.alloc(0))
            .then((apduResponse) => {
            const bakingApp = apduResponse[0] === 1;
            const major = apduResponse[1];
            const minor = apduResponse[2];
            const patch = apduResponse[3];
            return {
                major,
                minor,
                patch,
                bakingApp,
            };
        });
    }
}
