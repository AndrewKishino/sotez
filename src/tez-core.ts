import { ModuleOptions } from './types/sotez';

// Core Tez Module
export default class AbstractTezModule {
  _provider: string;
  _chain: string;

  constructor(
    provider: string,
    chain: string,
  ) {
    this._provider = provider;
    this._chain = chain;
  }

  get provider() {
    return this._provider;
  }

  set provider(provider: string) {
    this._provider = provider;
  }

  get chain() {
    return this._chain;
  }

  set chain(value: string) {
    this._chain = value;
  }

  setProvider(provider: string, chain: string = this.chain) {
    this._provider = provider;
    this._chain = chain;
  }
}
