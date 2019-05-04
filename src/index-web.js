import Sotez from './browser/tez-web';

// tez.js Base Modules
export { default as crypto } from './browser/crypto-web';
export { default as forge } from './forge';
export { default as utility } from './utility';
export { default as ledger } from './browser/ledger-web';
export { prefix, watermark, forgeMappings } from './constants';

export default Sotez;
