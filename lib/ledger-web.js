var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LedgerTransport from '@ledgerhq/hw-transport-u2f';
import LedgerApp from './hw-app-xtz/Tezos';
import { watermark as watermarkConst } from './constants';
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
const getAddress = ({ path = "44'/1729'/0'/0'", displayConfirm = true, curve = 0x00, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield LedgerTransport.create();
    const tezosLedger = new LedgerApp(transport);
    let publicKey;
    try {
        publicKey = yield tezosLedger.getAddress(path, displayConfirm, curve);
    }
    catch (e) {
        transport.close();
        return e;
    }
    transport.close();
    return publicKey;
});
/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @param {Uint8Array} [ledgerParams.watermark='03'] The watermark bytes
 * @returns {Promise} The signed operation
 * @example
 * ledger.signOperation({
 *   path = "44'/1729'/0'/0'",
 *   rawTxHex,
 *   curve = 0x00,
 * }).then((signature) => console.log(signature));
 */
const signOperation = ({ path = "44'/1729'/0'/0'", rawTxHex, curve = 0x00, watermark = watermarkConst.generic, }) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield LedgerTransport.create();
    const tezosLedger = new LedgerApp(transport);
    let signature;
    try {
        const watermarkHex = `00${watermark}`.slice(-2);
        ({ signature } = yield tezosLedger.signOperation(path, `${watermarkHex}${rawTxHex}`, curve));
    }
    catch (e) {
        transport.close();
        return e;
    }
    transport.close();
    return signature;
});
/**
 * @description Show the version of the ledger
 * @returns {Promise} The version info
 * @example
 * ledger.getVersion()
 *   .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
 */
const getVersion = () => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield LedgerTransport.create();
    const tezosLedger = new LedgerApp(transport);
    let versionInfo;
    try {
        versionInfo = yield tezosLedger.getVersion();
    }
    catch (e) {
        transport.close();
        return e;
    }
    transport.close();
    return versionInfo;
});
export default {
    getAddress,
    signOperation,
    getVersion,
};
