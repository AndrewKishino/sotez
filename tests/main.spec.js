import Tez, { utility, crypto } from '../index';

describe('sotez', () => {
  describe('utility', () => {
    test('mintotz', () => {
      const num1 = 1000000;
      const num2 = 9000000;
      expect(utility.totez(num1)).toBe(1);
      expect(utility.totez(num2)).toBe(9);
    });

    test('mutez', () => {
      const num = 0.000001;
      const num2 = 4294.967297;
      expect(utility.mutez(num)).toBe('1');
      expect(utility.mutez(num2)).toBe('4294967297');
    });

    test('b58cencode', () => {
      expect(utility.b58cencode([1], [2])).toBe('ztysqgT');
    });

    test('b58cdecode', () => {
      const data = JSON.stringify(utility.b58cdecode('ztysqgT', [2]));
      expect(data).toEqual(JSON.stringify({ type: 'Buffer', data: [1] }));
    });

    test('buf2hex', () => {
      expect(utility.buf2hex([1, 2])).toBe('0102');
    });

    test('hex2buf', () => {
      const data = JSON.stringify(utility.hex2buf('1e1d'));
      expect(data).toEqual('{"0":30,"1":29}');
    });

    test('hexNonce', () => {
      const length = 5;
      expect(utility.hexNonce(length)).toHaveLength(length);
    });

    test('sexp2mic', () => {
      expect(utility.sexp2mic('123')).toEqual({ int: '123' });
      expect(utility.sexp2mic('"456"')).toEqual({ string: '456' });
    });

    xtest('mic2arr', () => {
      // todo
    });

    xtest('ml2mic', () => {
      // todo
    });

    xtest('formatMoney', () => {
      // todo
    });
  });

  describe('crypto', () => {
    const TEST_KEYS = {
      sk: 'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV',
      pk: 'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
      pkh: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    };

    test('generateMnemonic', () => {
      const string = crypto.generateMnemonic();
      expect(string.split(' ')).toHaveLength(15);
    });

    test('checkAddress', () => {
      const checkedAddress = crypto.checkAddress(TEST_KEYS.pkh);
      expect(checkedAddress).toBe(true);
      const invalidAddress = crypto.checkAddress(`${TEST_KEYS.pkh}invalidstring`);
      expect(invalidAddress).toBe(false);
    });

    test('generateKeys', async () => {
      const keys = await crypto.generateKeys('test', 'p');
      expect(typeof keys.mnemonic).toBe('string');
      expect(typeof keys.passphrase).toBe('string');
      expect(typeof keys.pk).toBe('string');
      expect(keys.pk.length).toBe(54);
      expect(typeof keys.sk).toBe('string');
      expect(keys.sk.length).toBe(98);
      expect(typeof keys.pkh).toBe('string');
      expect(keys.pkh.length).toBe(36);
    });

    test('sign', async () => {
      const {
        bytes,
        sig,
        edsig,
        sbytes,
      } = await crypto.sign('AA5', TEST_KEYS.sk, new Uint8Array([3]));
      expect(typeof bytes).toBe('string');
      expect(bytes).toBe('AA5');
      expect(typeof sig).toBe('object');
      expect(sig).toEqual(new Uint8Array([225, 191, 138, 45, 52, 103, 197, 177, 247, 205, 158, 30, 166, 185, 91, 64, 101, 144, 141, 254, 44, 67, 146, 67, 190, 56, 75, 114, 91, 206, 191, 192, 95, 78, 140, 119, 247, 93, 207, 213, 143, 190, 20, 108, 233, 12, 2, 71, 201, 189, 51, 80, 193, 143, 155, 223, 205, 74, 93, 222, 73, 75, 253, 10]));
      expect(typeof edsig).toBe('string');
      expect(edsig).toBe('edsigu3LkYA7Z44N9w76tAwfgjdHRePmWaQsD5ESgab9AQQJE3HksfFkMZmrnoz9ayNw3QZqNwq4MTNkzyb4Ag9RmNdonUBs6RB');
      expect(typeof sbytes).toBe('string');
      expect(sbytes).toBe('AA5e1bf8a2d3467c5b1f7cd9e1ea6b95b4065908dfe2c439243be384b725bcebfc05f4e8c77f75dcfd58fbe146ce90c0247c9bd3350c18f9bdfcd4a5dde494bfd0a');
    });

    xtest('verify', async () => {
      const {
        sig,
        sbytes,
      } = await crypto.sign('AA5', TEST_KEYS.sk, new Uint8Array([3]));
      const verified = await crypto.verify(sbytes, sig, TEST_KEYS.pk);
      expect(verified).toBe(0);
    });
  });

  describe('core', () => {
    let tez;

    beforeEach(() => {
      tez = new Tez();
    });

    test('init params', () => {
      expect(tez.debugMode).toBe(false);
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      expect(tez.network).toBe('main');
      expect(tez.chain).toBe('main');
      expect(tez.defaultFee).toBe(1278);
    });

    test('set provider', () => {
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      tez.setProvider('http://127.0.0.1:8888');
      expect(tez.provider).toBe('http://127.0.0.1:8888');
    });
  });
});
