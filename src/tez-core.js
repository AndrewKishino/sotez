// @flow
import type { TezModuleInterface, ModuleOptions } from './types';

// Core Tez Module
export default class AbstractTezModule implements TezModuleInterface {
  _provider: string;
  _network: string;
  _defaultFee: number;
  _chain: string;

  constructor(
    provider: string,
    chain: string,
    network: string = 'main',
    options: ModuleOptions = {},
  ) {
    this._provider = provider;
    this._network = network;
    this._chain = chain;
    this._defaultFee = options.defaultFee || 1278;
  }

  get provider() {
    return this._provider;
  }

  set provider(provider: string) {
    this._provider = provider;
  }

  get network() {
    return this._network;
  }

  set network(network: string) {
    this._network = network;
  }

  get chain() {
    return this._chain;
  }

  set chain(value: string) {
    this._chain = value;
  }

  get defaultFee() {
    return this._defaultFee;
  }

  set defaultFee(fee: number) {
    this._defaultFee = fee;
  }

  setProvider(provider: string, chain: string = this.chain, network: string = this.network) {
    this._provider = provider;
    this._chain = chain;
    this._network = network;
  }
}
