import LedgerTransport from '@ledgerhq/hw-transport';
import TezosLedgerApp from './hw-app-xtz/Tezos';
import { magicBytes as magicBytesMap } from './constants';

interface LedgerGetAddress {
  transport: typeof LedgerTransport;
  path?: string;
  displayConfirm?: boolean;
  curve?: number;
}

interface LedgerSignOperation {
  transport: typeof LedgerTransport;
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
 * @param {Object} ledgerParams.transport The ledger transport to interface with
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The public key and public key hash
 * @example
 * ledger.getAddress({
 *   transport: LedgerTransport,
 *   path = "44'/1729'/0'/0'",
 *   displayConfirm = true,
 *   curve = 0x00,
 * }).then(({ address, publicKey }) => console.log(address, publicKey));
 */
export const getAddress = async ({
  transport,
  path = "44'/1729'/0'/0'",
  displayConfirm = true,
  curve = 0x00,
}: LedgerGetAddress = { transport: LedgerTransport}): Promise<{ address: string; publicKey: string }> => {
  if (!transport) {
    throw new Error(
      'A ledger transport must be provided in the argument parameters',
    );
  }
  const ledgerTransport = await transport.create();
  const tezosLedger = new TezosLedgerApp(ledgerTransport);
  let publicKey;
  try {
    publicKey = await tezosLedger.getAddress(path, displayConfirm, curve);
  } catch (e) {
    ledgerTransport.close();
    return e;
  }
  ledgerTransport.close();
  return publicKey;
};

/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {Object} ledgerParams.transport The ledger transport to interface with
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
  transport,
  path = "44'/1729'/0'/0'",
  rawTxHex,
  curve = 0x00,
  magicBytes = magicBytesMap.generic,
}: LedgerSignOperation): Promise<string> => {
  if (!transport) {
    throw new Error(
      'A ledger transport must be provided in the argument parameters',
    );
  }
  const ledgerTransport = await transport.create();
  const tezosLedger = new TezosLedgerApp(ledgerTransport);
  let signature;
  try {
    const magicBytesHex = `00${magicBytes}`.slice(-2);
    ({ signature } = await tezosLedger.signOperation(
      path,
      `${magicBytesHex}${rawTxHex}`,
      curve,
    ));
  } catch (e) {
    ledgerTransport.close();
    return e;
  }
  ledgerTransport.close();
  return signature;
};

/**
 * @description Show the version of the ledger
 * @param {LedgerTransport} transport The parameters of the signOperation function
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
export const getVersion = async (
  transport: typeof LedgerTransport,
): Promise<LedgerGetVersion> => {
  if (!transport) {
    throw new Error('A ledger transport must be provided as the argument');
  }
  const ledgerTransport = await transport.create();
  const tezosLedger = new TezosLedgerApp(ledgerTransport);
  let versionInfo;
  try {
    versionInfo = await tezosLedger.getVersion();
  } catch (e) {
    ledgerTransport.close();
    return e;
  }
  ledgerTransport.close();
  return versionInfo;
};

export default {
  getAddress,
  signOperation,
  getVersion,
};
