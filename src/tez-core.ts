import 'isomorphic-fetch';

export class AbstractTezModule {
  _provider: string;

  _chain: string;

  _debugMode: boolean;

  constructor(provider: string, chain: string, debugMode = false) {
    this._provider = provider;
    this._chain = chain;
    this._debugMode = debugMode;
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

  get debugMode(): boolean {
    return this._debugMode;
  }

  set debugMode(value: boolean) {
    this._debugMode = value;
  }

  setProvider(provider: string, chain: string = this.chain): void {
    this._provider = provider;
    this._chain = chain;
  }

  /**
   * @description Queries a node given a path and payload
   * @param {string} path The RPC path to query
   * @param {string} [payload] The payload of the query
   * @param {string} [method] The request method. Either 'GET' or 'POST'
   * @returns {Promise} The response of the query
   * @example
   * sotez.query(`/chains/main/blocks/head`)
   *  .then(head => console.log(head));
   */
  query = (path: string, payload?: any, method?: string): Promise<any> => {
    let queryMethod = method;
    let queryPayload = payload;

    if (!queryPayload) {
      if (!queryMethod) {
        queryMethod = 'GET';
      } else {
        queryPayload = {};
      }
    } else if (!queryMethod) {
      queryMethod = 'POST';
    }

    if (this._debugMode) {
      console.log('Query Request:', path, payload);
    }

    return fetch(`${this.provider}${path}`, {
      method: queryMethod,
      headers: {
        ...(queryMethod === 'POST'
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      body: JSON.stringify(queryPayload),
    }).then((response) => {
      if (this._debugMode) {
        console.log('Query Response:', path, response);
      }
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      return response.text();
    });
  };
}
