const axios = require('axios');

const defaultProvider = 'https://mytezoswallet.com:8732';

module.exports = {
  activeProvider: defaultProvider,
  debugMode: false,
  async: true,
  setDebugMode(t) {
    this.debugMode = t;
  },
  setProvider(u) {
    this.activeProvider = u;
  },
  resetProvider() {
    this.activeProvider = defaultProvider;
  },
  query(e, o) {
    if (typeof o === 'undefined') o = {};
    return axios.post(this.activeProvider + e, o, {
      headers: { 'Content-type': 'application/json' },
    }).then((response) => {
      if (this.debugMode) {
        console.log(e, o, response.data);
      }
      return response.data;
    });
  },
};
