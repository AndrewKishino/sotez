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
     * get Tezos address for a given BIP 32 path.
     * @param {string} path a path in BIP 32 format, must begin with 44'/1729'
     * @param {boolean} [boolDisplay=false] optionally enable or not the display
     * @param {number} [curve=0x00] optionally enable or not the chaincode request
     * @param {number} [apdu] to use a custom apdu. This should currently only be unset (which will choose
     *   an appropriate APDU based on the boolDisplay parameter), or else set to 0x0A
     *   for the special "display" APDU which uses the alternate copy "Your Key"
     * @return an object with a publicKey
     * @example
     * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
     */
    getAddress(path: string, boolDisplay?: boolean, curve?: number, apdu?: number): Promise<GetAddressResult>;
    sign(path: string, rawTxHex: string, curve: number | undefined, adpu: number): Promise<SignOperationResult>;
    signOperation(path: string, rawTxHex: string, curve?: number): Promise<SignOperationResult>;
    signHash(path: string, rawTxHex: string, curve?: number): Promise<SignOperationResult>;
    getVersion(): Promise<GetVersionResult>;
}
export {};
