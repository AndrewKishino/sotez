const { default: Sotez, utility, crypto, Key } = require('../index');

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
      sk:
        'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV',
      pk: 'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
      pkh: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    };

    test('generateMnemonic', () => {
      const string = crypto.generateMnemonic();
      expect(string.split(' ')).toHaveLength(24);
    });

    test('checkAddress', () => {
      const checkedAddress = crypto.checkAddress(TEST_KEYS.pkh);
      expect(checkedAddress).toBe(true);
      const invalidAddress = crypto.checkAddress(
        `${TEST_KEYS.pkh}invalidstring`,
      );
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
      const { bytes, sig, prefixSig, sbytes } = await crypto.sign(
        'AA5',
        TEST_KEYS.sk,
        new Uint8Array([3]),
      );
      expect(typeof bytes).toBe('string');
      expect(bytes).toBe('AA5');
      expect(typeof sig).toBe('string');
      expect(sig).toEqual(
        'sigsXHR6ten8B7sv7b2upVnKzusZgabmzchYgwrF9BQ4HGjTpHAMqGUicsmPXnsukgy2Mm2KGzckoEEo1y215oBajgYZPSsW',
      );
      expect(typeof prefixSig).toBe('string');
      expect(prefixSig).toBe(
        'edsigu3LkYA7Z44N9w76tAwfgjdHRePmWaQsD5ESgab9AQQJE3HksfFkMZmrnoz9ayNw3QZqNwq4MTNkzyb4Ag9RmNdonUBs6RB',
      );
      expect(typeof sbytes).toBe('string');
      expect(sbytes).toBe(
        'AA5e1bf8a2d3467c5b1f7cd9e1ea6b95b4065908dfe2c439243be384b725bcebfc05f4e8c77f75dcfd58fbe146ce90c0247c9bd3350c18f9bdfcd4a5dde494bfd0a',
      );
    });
  });

  describe('Key', () => {
    const TEST_KEYS = {
      sk:
        'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV',
      pk: 'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
      pkh: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    };

    const KEY1 = {
      esk:
        'edesk1mYD8xFHDsM5UWdf8RjrwyUr7yGo1tvDoWFun1kwAq8pDGJFBWH99SqcdQXX5tHVduFhUwBBZsPNVh2FwTR',
      sk:
        'edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y',
      pk: 'edpkuZWgrKbNiwAVZ42RnEiNwm2ipohxbPWXsxpofSLFDqcHjKnypg',
      pkh: 'tz1PTBQi6gTXxCynwvgzu9ga15jnE8WBRUnn',
    };

    const KEY2 = {
      sk:
        'edskSASdEH3A9w47bo8W2SgatKg5qeEucWLxNBXfPm2mus9kwV5H9d89C77ZG1qKdn4GG7Hc2jqcE4JKbimA93dZbSC3Qdkawn',
      pk: 'edpktuHJDoatxk5NcXfdHgFX15t2aZMxA3b5AoQZAzbeDNkiC416Xu',
      pkh: 'tz1UJesXieRG8cZHFUad63RwUfFqh9cwGzvW',
    };

    const KEY3 = {
      sk: 'spsk1TiZFkMU3drXhG81C4L9xC1X9BkR1uks6x22Vf9CVyZeaujHs6',
      pk: 'sppk7cwsGebcpnNwUA1oc2LJrHGXhAaGWVFkdjJrvgbupwP9UZR8sGu',
      pkh: 'tz2BteYCf2KPz7XdqzBtL5e9PsVTgsDFiiSA',
    };

    const KEY4 = {
      sk: 'p2sk2bp5ELfbhboEqMVeHCFqYupmT2xQfB3cVUrsmmctK8JKMGVxQf',
      pk: 'p2pk65a1FFgS58Qkn5tQvxWxvRHNkEVWWQXNKGrpSZg9TD3cBcfGUyi',
      pkh: 'tz3Wfj9Y87yUc1SYVvq1SZkyFtjf3BuaJnXT',
    };

    const FUNDRAISER_ACCOUNT = {
      mnemonic: [
        'spatial',
        'behave',
        'income',
        'advice',
        'guard',
        'isolate',
        'circle',
        'valve',
        'tag',
        'foot',
        'decline',
        'subway',
        'furnace',
        'ancient',
        'output',
      ],
      secret: '8731b6b8cd4b7b67e1e4b76010d8e9f13500ccb5',
      amount: '16474172439',
      pkh: 'tz1UJesXieRG8cZHFUad63RwUfFqh9cwGzvW',
      password: '9zojwTc88E',
      email: 'qvchryer.svikvvex@tezos.example.org',
    };

    test('import ed25519 secret key', async () => {
      const key = new Key({ key: KEY1.sk });
      await key.ready;

      expect(key.publicKey()).toBe(KEY1.pk);
      expect(key.publicKeyHash()).toBe(KEY1.pkh);
      expect(key.secretKey()).toBe(KEY1.sk);
    });

    test('import encrypted ed25519 secret key', async () => {
      const key = new Key({ key: KEY1.esk, passphrase: 'password' });
      await key.ready;

      expect(key.publicKey()).toBe(KEY1.pk);
      expect(key.publicKeyHash()).toBe(KEY1.pkh);
      expect(key.secretKey()).toBe(KEY1.sk);
    });

    test('import secp256k1 secret key', async () => {
      const key = new Key({ key: KEY3.sk });
      await key.ready;

      expect(key.publicKey()).toBe(KEY3.pk);
      expect(key.publicKeyHash()).toBe(KEY3.pkh);
      expect(key.secretKey()).toBe(KEY3.sk);
    });

    test('import p256 secret key', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      expect(key.publicKey()).toBe(KEY4.pk);
      expect(key.publicKeyHash()).toBe(KEY4.pkh);
      expect(key.secretKey()).toBe(KEY4.sk);
    });

    test('import fundraiser account', async () => {
      const key = new Key({
        key: FUNDRAISER_ACCOUNT.mnemonic.join(' '),
        passphrase: FUNDRAISER_ACCOUNT.password,
        email: FUNDRAISER_ACCOUNT.email,
      });
      await key.ready;

      expect(key.publicKey()).toBe(KEY2.pk);
      expect(key.publicKeyHash()).toBe(KEY2.pkh);
      expect(key.secretKey()).toBe(KEY2.sk);
    });

    test('sign ed25519', async () => {
      const key = new Key({ key: TEST_KEYS.sk });
      await key.ready;

      const { bytes, sig, prefixSig, sbytes } = await key.sign(
        'AA5',
        new Uint8Array([3]),
      );

      expect(typeof bytes).toBe('string');
      expect(bytes).toBe('AA5');
      expect(typeof sig).toBe('string');
      expect(sig).toEqual(
        'sigsXHR6ten8B7sv7b2upVnKzusZgabmzchYgwrF9BQ4HGjTpHAMqGUicsmPXnsukgy2Mm2KGzckoEEo1y215oBajgYZPSsW',
      );
      expect(typeof prefixSig).toBe('string');
      expect(prefixSig).toBe(
        'edsigu3LkYA7Z44N9w76tAwfgjdHRePmWaQsD5ESgab9AQQJE3HksfFkMZmrnoz9ayNw3QZqNwq4MTNkzyb4Ag9RmNdonUBs6RB',
      );
      expect(typeof sbytes).toBe('string');
      expect(sbytes).toBe(
        'AA5e1bf8a2d3467c5b1f7cd9e1ea6b95b4065908dfe2c439243be384b725bcebfc05f4e8c77f75dcfd58fbe146ce90c0247c9bd3350c18f9bdfcd4a5dde494bfd0a',
      );
    });

    test('verify ed25519', async () => {
      const key = new Key({ key: TEST_KEYS.sk });
      await key.ready;

      const { bytes, sig } = await key.sign('AA5');
      const verified = await key.verify(bytes, sig);
      expect(verified).toBe(true);
    });

    test('sign secp256k1', async () => {
      const key = new Key({ key: KEY3.sk });
      await key.ready;

      const { bytes, sig, prefixSig, sbytes } = await key.sign(
        'AA5',
        new Uint8Array([3]),
      );

      expect(typeof bytes).toBe('string');
      expect(bytes).toBe('AA5');
      expect(typeof sig).toBe('string');
      expect(sig).toEqual(
        'sigohcvcEykea7vTFiWyR5iung7FnxjXPD1HmDsXBbHo8naDo7LKWGdP3A1Jf6gsgY9btB6ZUFZUxT34Jb71KgfxrG5MGkXH',
      );
      expect(typeof prefixSig).toBe('string');
      expect(prefixSig).toBe(
        'spsig1XXJFfrEDzYGJdFUV7yENpU425aXob1uUrtYeKLu6h4W1HSvWtaeaWX1hgEBkGkQEKdKqXKszd7B8M1hct1BbBPNenvwAZ',
      );
      expect(typeof sbytes).toBe('string');
      expect(sbytes).toBe(
        'AA5c48937b4fbddcce04e883f2bba7671119dadea003e78b3c149290ee3d5a228bf28c78e2f6f786a6a3b5ab3a2ad0e3d65f2c2af5c0de64f04bdcfd5a7ba0537e4',
      );
    });

    test('verify secp256k1', async () => {
      const key = new Key({ key: KEY3.sk });
      await key.ready;

      const { bytes, sig } = await key.sign('AA5');
      const verified = await key.verify(bytes, sig);
      expect(verified).toBe(true);
    });

    test('sign p256', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      const { bytes, sig, prefixSig, sbytes } = await key.sign(
        'AA5',
        new Uint8Array([3]),
      );

      expect(typeof bytes).toBe('string');
      expect(bytes).toBe('AA5');
      expect(typeof sig).toBe('string');
      expect(sig).toEqual(
        'sigp69onNc6ShKF5VqU2iExV1fHZWuWmAm6tdJcsMPVkzNNnJXcygczjHXBe5MxnC9hT4DNsg5z4Co9eSjAtXR4xBmo9ZLij',
      );
      expect(typeof prefixSig).toBe('string');
      expect(prefixSig).toBe(
        'p2sigoQNesUABudMi1kbikJmjzUSfxB8mrbBKLQA1GopnySevKaJwMjiE1TwUq1tCDPj255jPwv2KZA7X38euUycWDt7iFk6Pf',
      );
      expect(typeof sbytes).toBe('string');
      expect(sbytes).toBe(
        'AA5c7816692b041b21ec0c4b3f927b51faf8604a567a83a052f0f2192f727aec2956fe64ba4bdcbe63af07d73cb2065f10832ffd80967463307fbcfe289f576346b',
      );
    });

    test('verify p256', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      const { bytes, sig } = await key.sign('AA5');
      const verified = await key.verify(bytes, sig);
      expect(verified).toBe(true);
    });
  });

  describe('core', () => {
    let tez;

    beforeEach(() => {
      tez = new Sotez();
    });

    test('init params', () => {
      expect(tez.debugMode).toBe(false);
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      expect(tez.chain).toBe('main');
      expect(tez.defaultFee).toBe(1420);
    });

    test('set provider', () => {
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      tez.setProvider('http://127.0.0.1:8888');
      expect(tez.provider).toBe('http://127.0.0.1:8888');
    });
  });
});
