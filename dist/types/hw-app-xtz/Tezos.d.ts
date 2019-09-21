/**
 * Tezos API
 *
 * @example
 * import Tezos from '@ledgerhq/hw-app-xtz';
 * const tez = new Tezos(transport)
 */
export default class Tezos {
    transport: any;
    constructor(transport: any);
    /**
     * get Tezos public key and address (key hash) for a given BIP 32 path.
     * @param path a path in BIP 32 format, must begin with 44'/1729'
     * @option boolDisplay optionally enable or not the display
     * @return an object with a publicKey
     * @example
     * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
     */
    getAddress(path: string, boolDisplay?: boolean, curve?: number): Promise<{
        publicKey: string;
        address: string;
    }>;
    signOperation(path: string, rawTxHex: string, curve?: number): Promise<{
        signature: string;
    }>;
    getVersion(): Promise<{
        major: number;
        minor: number;
        patch: number;
        bakingApp: boolean;
    }>;
}
