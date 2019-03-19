describe('sotez', () => {
  describe('utility', () => {
    const sotez = require('../index');
    const { utility } = sotez;

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
    const sotez = require('../index');
    const { crypto } = sotez;

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

  describe('node', () => {
    let sotez;
    let node;

    beforeEach(() => {
      sotez = require('../index');
      ({ node } = sotez);
    });

    test('init params', () => {
      expect(node.debugMode).toBe(false);
      expect(node.async).toBe(true);
      expect(node.activeProvider).toBe(sotez.DEFAULT_PROVIDER);
    });

    test('setDebugMode', () => {
      node.setDebugMode(true);
      expect(node.debugMode).toBe(true);

      node.setDebugMode(false);
      expect(node.debugMode).toBe(false);
    });

    test('setProvider', () => {
      node.setProvider('https://127.0.0.1:9734');
      expect(node.activeProvider).toBe('https://127.0.0.1:9734');
    });

    test('resetProvider', () => {
      node.setProvider('https://127.0.0.1:9734');
      node.resetProvider();
      expect(node.activeProvider).toBe(sotez.DEFAULT_PROVIDER);
    });

    describe('query', () => {
      const oldXMLHttpRequest = window.XMLHttpRequest;
      let mockXHR;

      const createMockXHR = responseJSON => ({
        open: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        responseText: JSON.stringify(responseJSON || {}),
      });

      beforeEach(() => {
        mockXHR = createMockXHR();
        window.XMLHttpRequest = jest.fn(() => mockXHR);
      });

      afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
      });

      test('query on error', () => {
        const p = node.query('/test');
        expect(mockXHR.open).toBeCalledWith('GET', 'http://127.0.0.1:8732/test', true);
        expect(mockXHR.send).toBeCalledWith();

        mockXHR.statusText = 'test';
        mockXHR.onerror();

        return expect(p).rejects.toEqual('test');
      });

      test('query on 200 error', () => {
        const p = node.query('/test');

        mockXHR.status = 200;
        mockXHR.responseText = JSON.stringify({
          error: 'err',
        });
        mockXHR.onload();

        return expect(p).rejects.toEqual('err');
      });

      test('query on 200 empty response', () => {
        const p = node.query('/test');

        mockXHR.status = 200;
        mockXHR.responseText = null;
        mockXHR.onload();

        return expect(p).rejects.toEqual('Empty response returned');
      });

      test('query on 200 empty response without', () => {
        const p = node.query('/test');

        mockXHR.status = 200;
        mockXHR.responseText = JSON.stringify({
          test: 'test',
        });
        mockXHR.onload();

        return expect(p).resolves.toEqual({
          test: 'test',
        });
      });

      test('query on 200 ok', () => {
        const p = node.query('/test');

        mockXHR.status = 200;
        mockXHR.responseText = JSON.stringify({
          ok: 'ok',
        });
        mockXHR.onload();

        return expect(p).resolves.toEqual('ok');
      });

      test('query non 200', () => {
        const p = node.query('/test');

        mockXHR.status = 400;
        mockXHR.responseText = undefined;
        mockXHR.statusText = 'err';
        mockXHR.onload();

        return expect(p).rejects.toEqual('err');
      });
    });
  });
});
