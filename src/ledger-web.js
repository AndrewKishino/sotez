// @flow
import type {
  Ledger as LedgerType,
  LedgerGetAddress,
  LedgerSignOperation,
  LedgerGetVersion,
} from './types';

// $FlowFixMe
const LedgerTransport = require('@ledgerhq/hw-transport-u2f').default;
const LedgerApp = require('./hw-app-xtz/lib/Tezos').default;

const ledger: LedgerType = {};
/**
 * @description Get the public key and public key hash from the ledger
 * @param {Object} ledgerParams The parameters of the getAddress function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {Boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {Number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The public key and public key hash
 * @example
 * ledger.getAddress({
 *   path = "44'/1729'/0'/0'",
 *   displayConfirm = true,
 *   curve = 0x00,
 * }).then(({ address, publicKey }) => console.log(address, publicKey))
 */
ledger.getAddress = async ({
  path = "44'/1729'/0'/0'",
  displayConfirm = false,
  curve = 0x00,
}: LedgerGetAddress = {}): Promise<{ address: string, publicKey: string }> => {
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
 * @param {Boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {Number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The signed operation
 * @example
 * ledger.signOperation({
 *   path = "44'/1729'/0'/0'",
 *   rawTxHex,
 *   curve = 0x00,
 * }).then((signature) => console.log(signature))
 */
ledger.signOperation = async ({
  path = "44'/1729'/0'/0'",
  rawTxHex,
  curve = 0x00,
}: LedgerSignOperation): Promise<string> => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let signature;
  try {
    ({ signature } = await tezosLedger.signOperation(path, `03${rawTxHex}`, curve));
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
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp))
 */
ledger.getVersion = async (): Promise<LedgerGetVersion> => {
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

export default ledger;
