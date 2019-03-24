// @flow
import _sodium from 'libsodium-wrappers';
import AbstractTezModule from '../tez-core';
import Tez from '../tez';
import { prefix } from '../constants';
import utility from '../utility';

import type {
  Tez as TezInterface,
  Contract as ContractInterface,
  ModuleOptions,
  ContractParams,
  LedgerDefault,
} from '../types';

export default class Contract extends AbstractTezModule implements ContractInterface {
  tez: TezInterface;

  constructor(provider: string, chain: string = 'main', net: string = 'main', options: ModuleOptions) {
    super(provider, chain, net, options);
    this.tez = new Tez(provider, chain, net, options);
  }

  hash = async (operationHash: string, ind: number) => {
    try {
      await _sodium.ready;
    } catch (e) {
      throw new Error(e);
    }

    const sodium = _sodium;
    const ob = utility.b58cdecode(operationHash, prefix.o);
    let tt = [];
    for (let i = 0; i < ob.length; i++) {
      tt.push(ob[i]);
    }
    tt = tt.concat([
      (ind & 0xff000000) >> 24,
      (ind & 0x00ff0000) >> 16,
      (ind & 0x0000ff00) >> 8,
      (ind & 0x000000ff),
    ]);
    // $FlowFixMe
    return utility.b58cencode(sodium.crypto_generichash(20, new Uint8Array(tt)), prefix.KT);
  }

  /**
   * @description Originate a new contract
   * @param {Object} paramObject The parameters for the operation
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
   * @param {String} paramObject.code The code to deploy for the contract
   * @param {String} paramObject.init The initial storage of the contract
   * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
   * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
   * @param {String} [paramObject.delegate] The delegate for the new account
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=10000] The storage limit to set for the transaction
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   */
  originate = ({
    keys,
    amount,
    code,
    init,
    spendable,
    delegatable,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10000,
    storageLimit = 10000,
  }: ContractParams, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  }: LedgerDefault = {}): Promise<any> => (
    this.tez.originate({
      keys,
      amount,
      code,
      init,
      spendable,
      delegatable,
      delegate,
      fee,
      gasLimit,
      storageLimit,
    }, { useLedger, path, curve })
  )

  /**
   * @description Get the current storage of a contract
   * @param {String} contractAddress The address of the contract
   * @returns {Promise} The storage of the contract
   */
  storage = (contractAddress: string): Promise<any> => (
    this.tez.query(`/chains/main/blocks/head/context/contracts/${contractAddress}/storage`)
  )

  /**
   * @description Get the contract at a given address
   * @param {String} contractAddress The address of the contract
   * @returns {Promise} The contract
   */
  load = (contractAddress: string): Promise<any> => (
    this.tez.query(`/chains/main/blocks/head/context/contracts/${contractAddress}`)
  )

  /**
   * @description Watch a contract's storage based on a given interval
   * @param {String} contractAddress The address of the contract
   * @param {Number} timeout The interval between checks in milliseconds
   * @param {requestCallback} callback The callback to fire when a change is detected
   * @returns {Object} The setInterval object
   */
  watch = (contractAddress: string, timeout: number, callback: (any) => any): IntervalID => {
    let storage = [];
    const storageCheck = () => {
      this.storage(contractAddress).then((response) => {
        if (JSON.stringify(storage) !== JSON.stringify(response)) {
          storage = response;
          callback(storage);
        }
      });
    };
    storageCheck();
    return setInterval(storageCheck, timeout * 1000);
  }
}
