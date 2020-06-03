import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import LedgerApp from './hw-app-xtz/Tezos';
import { magicBytes as magicBytesMap } from './constants';

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
export const getAddress = async ({
  path = "44'/1729'/0'/0'",
  displayConfirm = true,
  curve = 0x00,
}: LedgerGetAddress = {}): Promise<{ address: string; publicKey: string }> => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let publicKey;
  try {
    publicKey = await tezosLedger.getAddress(path, displayConfirm, curve);
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return publicKey;
};

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
export const signOperation = async ({
  path = "44'/1729'/0'/0'",
  rawTxHex,
  curve = 0x00,
  magicBytes = magicBytesMap.generic,
}: LedgerSignOperation): Promise<string> => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let signature;
  try {
    const magicBytesHex = `00${magicBytes}`.slice(-2);
    ({ signature } = await tezosLedger.signOperation(
      path,
      `${magicBytesHex}${rawTxHex}`,
      curve,
    ));
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return signature;
};

/**
 * @description Show the version of the ledger
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
export const getVersion = async (): Promise<LedgerGetVersion> => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let versionInfo;
  try {
    versionInfo = await tezosLedger.getVersion();
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return versionInfo;
};

export default {
  getAddress,
  signOperation,
  getVersion,
};
