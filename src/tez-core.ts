export class AbstractTezModule {
  _provider: string;
  _chain: string;

  constructor(provider: string, chain: string) {
    this._provider = provider;
    this._chain = chain;
  }

  get provider(): string {
    return this._provider;
  }

  set provider(provider: string) {
    this._provider = provider;
  }

  get chain(): string {
    return this._chain;
  }

  set chain(value: string) {
    this._chain = value;
  }

  setProvider(provider: string, chain: string = this.chain): void {
    this._provider = provider;
    this._chain = chain;
  }
}
