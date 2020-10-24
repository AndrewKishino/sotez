/// <reference types="ledgerhq__hw-transport" />
import LedgerTransport from '@ledgerhq/hw-transport';

interface LedgerGetAddress {
  transport: typeof LedgerTransport;
  path?: string;
  displayConfirm?: boolean;
  curve?: string;
}
interface LedgerSignOperation {
  transport: typeof LedgerTransport;
  path?: string;
  rawTxHex: string;
  curve?: string;
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
 * @param {Object} ledgerParams.transport The ledger transport to interface with
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {string} [ledgerParams.curve=tz1] The value which defines the curve (tz1=0x00, tz2=0x01, tz3=0x02)
 * @returns {Promise} The public key and public key hash
 * @example
 * ledger.getAddress({
 *   transport: LedgerTransport,
 *   path = "44'/1729'/0'/0'",
 *   displayConfirm = true,
 *   curve = 'tz1',
 * }).then(({ address, publicKey }) => console.log(address, publicKey));
 */
export declare const getAddress: ({
  transport,
  path,
  displayConfirm,
  curve,
}?: LedgerGetAddress) => Promise<{
  address: string;
  publicKey: string;
}>;
/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {Object} ledgerParams.transport The ledger transport to interface with
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {string} [ledgerParams.curve=tz1] The value which defines the curve (tz1=0x00, tz2=0x01, tz3=0x02)
 * @param {Uint8Array} [ledgerParams.magicBytes='03'] The magic bytes for the operation
 * @returns {Promise} The signed operation
 * @example
 * ledger.signOperation({
 *   path = "44'/1729'/0'/0'",
 *   rawTxHex,
 *   curve = 'tz1',
 * }).then((signature) => console.log(signature));
 */
export declare const signOperation: ({
  transport,
  path,
  rawTxHex,
  curve,
  magicBytes,
}: LedgerSignOperation) => Promise<string>;
/**
 * @description Show the version of the ledger
 * @param {LedgerTransport} transport The parameters of the signOperation function
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
export declare const getVersion: (
  transport: typeof LedgerTransport,
) => Promise<LedgerGetVersion>;
declare const _default: {
  getAddress: ({
    transport,
    path,
    displayConfirm,
    curve,
  }?: LedgerGetAddress) => Promise<{
    address: string;
    publicKey: string;
  }>;
  signOperation: ({
    transport,
    path,
    rawTxHex,
    curve,
    magicBytes,
  }: LedgerSignOperation) => Promise<string>;
  getVersion: (transport: typeof LedgerTransport) => Promise<LedgerGetVersion>;
};
export default _default;
