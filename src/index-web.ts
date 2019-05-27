import Sotez from './web/tez-web';

// tez.js Base Modules
export { default as Key } from './key';
export { default as crypto } from './crypto';
export { default as forge } from './forge';
export { default as utility } from './utility';
export { default as ledger } from './web/ledger-web';
export { prefix, watermark, forgeMappings } from './constants';

export default Sotez;
