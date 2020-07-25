interface LedgerGetAddress {
    path?: string;
    displayConfirm?: boolean;
    curve?: number;
}
interface LedgerSignOperation {
    path?: string;
    rawTxHex: string;
    curve?: number;
    magicBytes?: Uint8Array;
}
interface LedgerGetVersion {
    major: number;
    minor: number;
    patch: number;
    bakingApp: boolean;
}
/**
 * @description Get the public key and public key hash from the ledger
 * @param {Object} ledgerParams The parameters of the getAddress function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The public key and public key hash
 * @example
 * ledger.getAddress({
 *   path = "44'/1729'/0'/0'",
 *   displayConfirm = true,
 *   curve = 0x00,
 * }).then(({ address, publicKey }) => console.log(address, publicKey));
 */
export declare const getAddress: ({ path, displayConfirm, curve, }?: LedgerGetAddress) => Promise<{
    address: string;
    publicKey: string;
}>;
/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @param {Uint8Array} [ledgerParams.magicBytes='03'] The magic bytes for the operation
 * @returns {Promise} The signed operation
 * @example
 * ledger.signOperation({
 *   path = "44'/1729'/0'/0'",
 *   rawTxHex,
 *   curve = 0x00,
 * }).then((signature) => console.log(signature));
 */
export declare const signOperation: ({ path, rawTxHex, curve, magicBytes, }: LedgerSignOperation) => Promise<string>;
/**
 * @description Show the version of the ledger
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
export declare const getVersion: () => Promise<LedgerGetVersion>;
declare const _default: {
    getAddress: ({ path, displayConfirm, curve, }?: LedgerGetAddress) => Promise<{
        address: string;
        publicKey: string;
    }>;
    signOperation: ({ path, rawTxHex, curve, magicBytes, }: LedgerSignOperation) => Promise<string>;
    getVersion: () => Promise<LedgerGetVersion>;
};
export default _default;
