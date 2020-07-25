import XMLHttpRequest from 'xhr2';

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
   * @param {string} payload The payload of the query
   * @param {string} method The request method. Either 'GET' or 'POST'
   * @returns {Promise} The response of the query
   * @example
   * sotez.query(`/chains/main/blocks/head`)
   *  .then(head => console.log(head));
   */
  query = (path: string, payload?: any, method?: string): Promise<any> => {
    if (typeof payload === 'undefined') {
      if (typeof method === 'undefined') {
        method = 'GET';
      } else {
        payload = {};
      }
    } else if (typeof method === 'undefined') {
      method = 'POST';
    }
    return new Promise((resolve, reject) => {
      try {
        const http = new XMLHttpRequest();
        // @ts-ignore
        http.open(method, this.provider + path, true);
        http.onload = (): void => {
          if (this._debugMode) {
            console.log('Node call:', path, payload);
          }
          if (http.status === 200) {
            if (http.responseText) {
              let response = JSON.parse(http.responseText);
              if (this._debugMode) {
                console.log('Node response:', path, response);
              }
              if (response && typeof response.error !== 'undefined') {
                reject(response.error);
              } else {
                if (response && typeof response.ok !== 'undefined')
                  response = response.ok;
                resolve(response);
              }
            } else {
              reject('Empty response returned'); // eslint-disable-line
            }
          } else if (http.responseText) {
            reject(http.responseText);
          } else {
            reject(http.statusText);
          }
        };
        http.onerror = (): void => {
          reject(http.statusText);
        };
        if (method === 'POST') {
          http.setRequestHeader('Content-Type', 'application/json');
          http.send(JSON.stringify(payload));
        } else {
          http.send();
        }
      } catch (e) {
        reject(e);
      }
    });
  };
}
