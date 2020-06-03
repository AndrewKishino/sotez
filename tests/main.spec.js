const toBuffer = require('typedarray-to-buffer');
const {
  Sotez,
  utility,
  crypto,
  Key,
  magicBytes: magicBytesMap,
} = require('../index');

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
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        TEST_KEYS.sk,
      );
      expect(bytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'signbSDjRLqbbSUrM1nnjqhJF4PG48Uvwo9rC6KMoC2Dt5VTq6mfBAF4GBUfB4WfcKteBqDDbqRtEvR9kRvNayXVMjkkGSJD',
      );
      expect(prefixSig).toBe(
        'edsigtxQuLneF7XnUY3LJvpb2ebXaA694TZpPXXwq3hoB2Zu2oHmhGZ6FL7W6XFnrc8ngLBfT8jPCGWCh9wndaWvwiYRqdJkr2V',
      );
      expect(sbytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031bbc13ce88adb9025fe4441b6c862c79092b23f2b9c67d277c52a853e3966e67d4284305d6d9563bc847a8151b9353c502cfa2c695f1e983f14119a9cfa9137709',
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

    const KEY5 = {
      sk: 'spsk33kCcKpgrvXRQJB2GVGxAMxrSEmwKXLh2KR4ztLcbaCnQq3FFs',
      pk: 'sppk7bFd7b4DWcabg4yw4N5q8rn9thycWmY21EJDCKfTskNiBH8RJrd',
      pkh: 'tz2JFbdFh1RVYuYX4gWbVQz9SAtqEZSwZaB8',
    };

    const KEY6 = {
      sk: 'p2sk2ke47zhFz3znRZj39TW5KKS9VgfU1Hax7KeErgnShNe9oQFQUP',
      pk: 'p2pk67RwD3PTiuL9hzw7UMjivMLsMCmfcgqaCd6doYKEXPjNR7xsram',
      pkh: 'tz3bBDnPj3Bvek1DeJtsTvicBUPEoTpm2ySt',
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

    test('import secp256k1 alternate secret key', async () => {
      const key = new Key({ key: KEY5.sk });
      await key.ready;

      expect(key.publicKey()).toBe(KEY5.pk);
      expect(key.publicKeyHash()).toBe(KEY5.pkh);
      expect(key.secretKey()).toBe(KEY5.sk);
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
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );

      expect(bytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'signbSDjRLqbbSUrM1nnjqhJF4PG48Uvwo9rC6KMoC2Dt5VTq6mfBAF4GBUfB4WfcKteBqDDbqRtEvR9kRvNayXVMjkkGSJD',
      );
      expect(prefixSig).toBe(
        'edsigtxQuLneF7XnUY3LJvpb2ebXaA694TZpPXXwq3hoB2Zu2oHmhGZ6FL7W6XFnrc8ngLBfT8jPCGWCh9wndaWvwiYRqdJkr2V',
      );
      expect(sbytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031bbc13ce88adb9025fe4441b6c862c79092b23f2b9c67d277c52a853e3966e67d4284305d6d9563bc847a8151b9353c502cfa2c695f1e983f14119a9cfa9137709',
      );
    });

    test('verify ed25519', async () => {
      const key = new Key({ key: TEST_KEYS.sk });
      await key.ready;

      const { bytes, magicBytes, prefixSig } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );
      const verified = await key.verify(`${magicBytes}${bytes}`, prefixSig);
      expect(verified).toBe(true);
    });

    test('sign secp256k1', async () => {
      const key = new Key({ key: KEY3.sk });
      await key.ready;

      const { bytes, sig, prefixSig, sbytes } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );

      expect(bytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'sigfkE9V9jFZ7sSqavrDsjM3HKVXYwsidipAsEaFRaEFWFKhpfLEaKv8dxWsRqmmUYQHbrdCqCrzK2ssTTKDWL1z5U5MnxmV',
      );
      expect(prefixSig).toBe(
        'spsig1PZuUYkyiu61q1agpNRszwxhQMLWwnGRHjzZM3at39RxkmUUWoehsG7pDEzvqAYQV1M1NAgqJ8TkyAAZq6BpwCcaZWUf8w',
      );
      expect(sbytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b87bb18568530299de6a35b5665e346a5c82a213c838b2743f2b35351b1cf28f557fb57ae044020ec79865b14b68c7c3c884f9074db40ce38e074fb860c07a0b0',
      );
    });

    test('verify secp256k1', async () => {
      const key = new Key({ key: KEY3.sk });
      await key.ready;

      const { bytes, magicBytes, prefixSig } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );
      const verified = await key.verify(`${magicBytes}${bytes}`, prefixSig);
      expect(verified).toBe(true);
    });

    test('sign p256', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      const { bytes, sig, prefixSig, sbytes } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );

      expect(bytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'signJQN7BzCGtgcBxLnCrbFK6qjcK3sahvZm6EugDSnJnk7Q5MBGMAsnHgHp3AzweDMjJ21NtPnkQjLPNi62EKTu4JciR9jP',
      );
      expect(prefixSig).toBe(
        'p2sigmcdDCHYHjpj58D72vT82pZd7zyH8g8LnCs6J5ft5XF2ewM8VeQG74U6azyhENqngMKY2T8L8FN3hn4dpcgWuAkeaMBf6e',
      );
      expect(sbytes).toBe(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031bb9d531b2b34664fcbaefcbb597420535de3d764713b151c836631b02758710b85a4d331e123d20e00091dde541a09d1877cbd78f9b6bdc7c1a2940d0012ffda1',
      );
    });

    test('verify p256', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      const { bytes, magicBytes, prefixSig } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );
      const verified = await key.verify(`${magicBytes}${bytes}`, prefixSig);
      expect(verified).toBe(true);
    });

    test('verify invalid p256', async () => {
      const key = new Key({ key: KEY4.sk });
      await key.ready;

      const { bytes, magicBytes, prefixSig } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );

      const altKey = new Key({ key: KEY6.sk });
      await altKey.ready;

      const verified = await altKey.verify(`${magicBytes}${bytes}`, prefixSig);
      expect(verified).toBe(false);
    });

    it('sign p256 producing signature that needs padding', async () => {
      const key = new Key({ key: KEY6.sk });
      await key.ready;
      expect(key.publicKey()).toBe(KEY6.pk);
      expect(key.publicKeyHash()).toBe(KEY6.pkh);
      expect(key.secretKey()).toBe(KEY6.sk);
      expect(
        (
          await key.sign(
            '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
            magicBytesMap.generic,
          )
        ).prefixSig,
      ).toEqual(
        'p2sigMMsHbzzKh6Eg3cDxfLURiUpTMkyjyPWd7RFtBUH7ZyGBzBqMZH9xZc16akQWZNKkCMHnf1vYjjckPEfru456ikHaFWXFD',
      );
    });

    test('verify p256 producing signature that needs padding', async () => {
      const key = new Key({ key: KEY6.sk });
      await key.ready;

      const { bytes, magicBytes, prefixSig } = await key.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        magicBytesMap.generic,
      );
      const verified = await key.verify(`${magicBytes}${bytes}`, prefixSig);
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

    test('init options', () => {
      tez = new Sotez('http://127.0.0.1:8732', 'test', {
        debugMode: true,
        defaultFee: 1234,
        useMutez: false,
      });
      expect(tez.debugMode).toBe(true);
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      expect(tez.chain).toBe('test');
      expect(tez.defaultFee).toBe(1234);
      expect(tez.useMutez).toBe(false);
      expect(tez.localForge).toBe(true);
      expect(tez.validateLocalForge).toBe(false);
    });

    test('set provider', () => {
      expect(tez.provider).toBe('http://127.0.0.1:8732');
      tez.setProvider('http://127.0.0.1:8888');
      expect(tez.provider).toBe('http://127.0.0.1:8888');
    });
  });
});
