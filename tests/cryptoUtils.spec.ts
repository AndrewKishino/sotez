import { cryptoUtils, magicBytes as magicBytesMap } from '../src';

const TEST_KEY = {
  sk: 'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV',
  pk: 'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
  pkh: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
};

const KEY_ED25519 = 'edsk3Z2t7t1XimympW62RmUDQeBxn9dw3pQdxxhpAGngmkjiFuXUAj';
const KEY_ED25519_ALT =
  'edskRqqHqAnB7Yw94ZPArZdonoShmnAmi42uwxcETBBnPwu4Kz1iY7P1xTJr4M3em1bLLb6tLeo9sTSDXnzmH6iixBgL5fFB37';
const KEY_SECP256K1 = 'spsk2BbX6umbLYLmb1yLFWEFZPSkeJt4WWomhuhbuqc13LxrhXDA3i';
const KEY_P256 = 'p2sk3NKhFyDQ74wsBBYDLZ2BpRcHBPhV1BkxBuvDJP2zuqZ23vL5gy';
const ENCRYPTED_KEY_ED25519 =
  'edesk1RK4W4Qdo6tUwf5oB1swQMXnxJwPo6vWDmWNJEQUbsfA4auJiXdWkXk3JWyzNPAugcQaQuoui1hpNfWfYtK';
const DECRYPTED_KEY_ED25519 =
  'edskRhQtHKMHVf3FDbnqhorMMVXrvgTVNJinVx6WQXb8RVXdKG5PVL5R7JsXU4Sc24wgG5Q5csQBcCQVVd98iSF1QJWjoHLW11';
const ENCRYPTED_KEY_SECP256K1 =
  'spesk1yA7DvBDoPgRy8zodnSC8hUqYHyLd6hcytJFZxWuZAxqbD6puYDEPocKARg7ypNfbAHBrLhdJnzF2sSWkWA';
const DECRYPTED_KEY_SECP256K1 =
  'spsk2s751r1FUCFnGP7dNz4fXAZTEeiHyrxkZusCvgAhbJUwtbJxxV';
const ENCRYPTED_KEY_P256 =
  'p2esk1sdyxFT4UDvJjFneCc2vQgGxMpznR9cDk7gykyBwDGPJPHRYcp5DLLGoSBAtRBaDqmTHJPvT4ZpUURdKCny';
const DECRYPTED_KEY_P256 =
  'p2sk3T9fYpibobxRr7daoPzywLpLAXJVd3bkXpAaqYVtVB37aAp7bU';

describe('cryptoUtils', () => {
  describe('extractKeys', () => {
    it('ed25519 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_ED25519);
      expect(extractedKeys.sk).toBe(KEY_ED25519);
      expect(extractedKeys.pk).toBe(
        'edpktkMe2an4WSByUyoGW4sxRPMpr4o7Ka9J72JJetqqothP4KzHof',
      );
      expect(extractedKeys.pkh).toBe('tz1iZDVj66qc6WsZtzR1zuuzVwNN7oJAu96v');
    });

    it('ed25519 long secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_ED25519_ALT);
      expect(extractedKeys.sk).toBe(KEY_ED25519_ALT);
      expect(extractedKeys.pk).toBe(
        'edpkvNGUd3xcBNmPWRbXJoS6WEvxu1BVoWjHr7ab7QoAJFFqhx9tkR',
      );
      expect(extractedKeys.pkh).toBe('tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9');
    });

    it('secp256k1 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_SECP256K1);
      expect(extractedKeys.sk).toBe(KEY_SECP256K1);
      expect(extractedKeys.pk).toBe(
        'sppk7cqnSb5pGaJYtoWX1tK1SiRJoCD2ucviYN3V4NbTcWcs9ycBhBg',
      );
      expect(extractedKeys.pkh).toBe('tz2Pzk35AtEZHazgqHgY2ewkRSK7qHGH2muf');
    });

    it('p256 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_P256);
      expect(extractedKeys.sk).toBe(KEY_P256);
      expect(extractedKeys.pk).toBe(
        'p2pk66j3SVx5k2gaj5RqWowNcKGegA2yas8MswNhSHGUVC4NC3WkHy4',
      );
      expect(extractedKeys.pkh).toBe('tz3XrPigFNCdb2g1rf3myEA9qf6Zhdukuf4e');
    });

    it('encrypted ed25519 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_ED25519,
        'password',
      );
      expect(extractedKeys.sk).toBe(DECRYPTED_KEY_ED25519);
      expect(extractedKeys.esk).toBe(ENCRYPTED_KEY_ED25519);
      expect(extractedKeys.pk).toBe(
        'edpkukxv7oB4BFbCy7dMhKprqrRRPjPGqgaNpq5LVNWN84X2UNAZ9P',
      );
      expect(extractedKeys.pkh).toBe('tz1R8LazMuf2NsUWwiDa8s5hXsTiHbgZw9Xr');
    });

    it('encrypted secp256k1 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_SECP256K1,
        'password',
      );
      expect(extractedKeys.sk).toBe(DECRYPTED_KEY_SECP256K1);
      expect(extractedKeys.esk).toBe(ENCRYPTED_KEY_SECP256K1);
      expect(extractedKeys.pk).toBe(
        'sppk7ZmtvV88cNUWkZtPydRMbqGniqRfh9SJwL6Vsmq4AegJnEXGtUX',
      );
      expect(extractedKeys.pkh).toBe('tz2LQ4dU9Zi5WWqb86KSswsYCgtbATsiwLuv');
    });

    it('encrypted p256 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_P256,
        'password',
      );
      expect(extractedKeys.sk).toBe(DECRYPTED_KEY_P256);
      expect(extractedKeys.esk).toBe(ENCRYPTED_KEY_P256);
      expect(extractedKeys.pk).toBe(
        'p2pk67TtJ4sPmmeMqdrmVFhva8MuhyQNhpBzuBZwTeqSktMwPVH52GL',
      );
      expect(extractedKeys.pkh).toBe('tz3eViPDJxn5EaYfrqVSmzRss4AGAnutEvox');
    });
  });

  describe('encryptSecretKey', () => {
    it('should encrypt ed25519 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_ED25519);
      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        extractedKeys.sk,
        'password',
      );

      const extractedEncryptedKey = await cryptoUtils.extractKeys(
        encryptedSecretKey,
        'password',
      );

      expect(extractedKeys.pk).toBe(extractedEncryptedKey.pk);
      expect(extractedKeys.pkh).toBe(extractedEncryptedKey.pkh);
    });

    it('should encrypt ed25519 secret keys with salt', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_ED25519,
        'password',
      );

      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        DECRYPTED_KEY_ED25519,
        'password',
        extractedKeys.salt,
      );

      expect(encryptedSecretKey).toBe(ENCRYPTED_KEY_ED25519);
    });

    it('should encrypt secp256k1 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_SECP256K1);
      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        extractedKeys.sk,
        'password',
      );

      const extractedEncryptedKey = await cryptoUtils.extractKeys(
        encryptedSecretKey,
        'password',
      );

      expect(extractedKeys.pk).toBe(extractedEncryptedKey.pk);
      expect(extractedKeys.pkh).toBe(extractedEncryptedKey.pkh);
    });

    it('should encrypt secp256k1 secret keys with salt', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_SECP256K1,
        'password',
      );

      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        DECRYPTED_KEY_SECP256K1,
        'password',
        extractedKeys.salt,
      );

      expect(encryptedSecretKey).toBe(ENCRYPTED_KEY_SECP256K1);
    });

    it('should encrypt p256 secret keys', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(KEY_P256);
      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        extractedKeys.sk,
        'password',
      );

      const extractedEncryptedKey = await cryptoUtils.extractKeys(
        encryptedSecretKey,
        'password',
      );

      expect(extractedKeys.pk).toBe(extractedEncryptedKey.pk);
      expect(extractedKeys.pkh).toBe(extractedEncryptedKey.pkh);
    });

    it('should encrypt p256 secret keys with salt', async () => {
      const extractedKeys = await cryptoUtils.extractKeys(
        ENCRYPTED_KEY_P256,
        'password',
      );

      const encryptedSecretKey = await cryptoUtils.encryptSecretKey(
        DECRYPTED_KEY_P256,
        'password',
        extractedKeys.salt,
      );

      expect(encryptedSecretKey).toBe(ENCRYPTED_KEY_P256);
    });
  });

  describe('generateMnemonic', () => {
    it('should generate a length of 15 words', () => {
      const mnemonic = cryptoUtils.generateMnemonic();
      expect(mnemonic.split(' ')).toHaveLength(15);
    });
  });

  describe('checkAddress', () => {
    it('should validate a valid address', () => {
      const checkedAddress = cryptoUtils.checkAddress(TEST_KEY.pkh);
      expect(checkedAddress).toBe(true);
    });
    it('should invalidate a invalid address', () => {
      const invalidAddress = cryptoUtils.checkAddress(
        `${TEST_KEY.pkh}invalidstring`,
      );
      expect(invalidAddress).toBe(false);
    });
  });

  describe('generateKeys', () => {
    it('should generate a set of keys', async () => {
      const keys = await cryptoUtils.generateKeys(
        'cheap fragile melody asset lamp wasp eyebrow mean blood another nerve still creek section creek',
        'password',
      );
      expect(keys.mnemonic).toBe(
        'cheap fragile melody asset lamp wasp eyebrow mean blood another nerve still creek section creek',
      );
      expect(keys.passphrase).toBe('password');
      expect(keys.pk).toBe(
        'edpkuTWNQnQSWhsGdPiTfdo6JhRdAdtGaXT16Xd69AFSgRHu6Y1sYJ',
      );
      expect(keys.pk.length).toBe(54);
      expect(keys.sk).toBe(
        'edskS1QA5EQeAzxLP2SJJvGvHTooz5v9UngdxVWHVRwrTZRtMtfTsqvYBqv4x5orq7WvgGksVXw2SPMoLqnADNs8fJ9THM4mXS',
      );
      expect(keys.sk.length).toBe(98);
      expect(keys.pkh).toBe('tz1hALbJbG3X1BgNHimVF8A11urkvHJgYUat');
      expect(keys.pkh.length).toBe(36);
    });

    it.each([
      {
        path: "44'/1729'/0'/0'",
        pkh: 'tz1TyyX7U6r6tB1uSS4aUnfKX9rj3y9NCEVL',
      },
      {
        path: "44'/1729'/1'/0'",
        pkh: 'tz1WCBJKr1rRivyCnN9hREpRAMqrLdmqDcym',
      },
      {
        path: "44'/1729'/2147483647'/0'",
        pkh: 'tz1WKKg7eN7rADsFrfzZmRrEECfBcZbXKtvS',
      },
      {
        path: "44'/1729'/1'/1'/1'",
        pkh: 'tz1dAgezeiGexQkgfbPm8MgP1XTqA4rJRt3C',
      },
    ])(
      'should correctly generate HD account keys for path $path',
      async (derivation) => {
        const TEST_MNEMONIC =
          'gym exact clown can answer hope sample mirror knife twenty powder super imitate lion churn almost shed chalk dust civil gadget pyramid helmet trade';
        const keys = await cryptoUtils.generateKeys(
          TEST_MNEMONIC,
          undefined,
          derivation.path,
        );
        expect(derivation.pkh).toBe(keys.pkh);
      },
    );
  });

  describe('sign', () => {
    it('should sign ed25519', async () => {
      const { bytes, sig, prefixSig, sbytes } = await cryptoUtils.sign(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_ED25519,
      );
      expect(bytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'sigh3GoN84ooqnkhbQUDFQTxgTVzxaYhFVq6FCJRJ3Xg6vJx5K2TD4Dqnp6sM6W3b1F82njhXwzLCDLTrgWXgrR4wx5mLFpj',
      );
      expect(prefixSig).toBe(
        'edsigtrrjvRLy5k2potahcF6bRFxyGq3WXL86Cmzw2mJ2Y27scn1uXM89Ju2j9TxtbWmMgfWQfDKJpx9z5FttAg2pc8243ogc1m',
      );
      expect(sbytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b919eeea48dcf64fd43d62d0171c3e00519714b12ddab0470b78e4896776e449015f630576969caa84cd53c3f0ff2da37dc351c0943dea3dcba838f4e31a1f10f',
      );
    });

    it('should sign secp256k1', async () => {
      const { bytes, sig, prefixSig, sbytes } = await cryptoUtils.sign(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_SECP256K1,
      );
      expect(bytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'sigSiqbTzB1RSGzFquomxbwSWUH6LW9xzDfrRDXPAyWRGQCJ5EDqTJj3Xv1W1nXNepZxtRjCvJeWSH7nWub2oXZXCLhnBbox',
      );
      expect(prefixSig).toBe(
        'spsig1AYWvXbRUmQRNRqfmvWkbMBrBv85E2cv9RYYJBLHKKC7dMj3QQXggB1mhsasamigegdaUAmw5eb1D5E26uV2UjjTDgBtvD',
      );
      expect(sbytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b242e5a14def6bf5e15add480131329c741a6c65a680c988ed84ccc573f47e25703bd45b6996e8766d7dff67b355c08198e6ac9a8e1839a9a4f91902c9541cb1e',
      );
    });

    it('should sign p256', async () => {
      const { bytes, sig, prefixSig, sbytes } = await cryptoUtils.sign(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_P256,
      );
      expect(bytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
      );
      expect(sig).toEqual(
        'sigUx1aFCscihwJiJRkAPhRfK29UcCXnN4SE27GhnBFM7KVTzkD5rF5kk9zKAEDi2aUC1hYhLByybqQkSuqa64jEjBnYFe9A',
      );
      expect(prefixSig).toBe(
        'p2sigUGERLJRiBdymeZBzszEDAmoXsGRnsnUefnxf7EcYZZc31GXXTuLK2vaHW6kT9E9np3DZma8KUZ9n98qaAYGAWRXjio7m1',
      );
      expect(sbytes).toBe(
        '03051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b3534430c1244cd05e8c2a4a9d2e6a447e7f0db7187ea6e2bbe34f89936bc332043c1837560e6d128048b03cca549497eeb2a738d442e3a1571c346ecaed92dee',
      );
    });
  });

  describe('verify', () => {
    it('verify ed25519', async () => {
      const { bytes, magicBytes, prefixSig } = await cryptoUtils.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_ED25519,
        magicBytesMap.generic,
      );
      const verified = await cryptoUtils.verify(
        `${magicBytes}${bytes}`,
        prefixSig,
        'edpktkMe2an4WSByUyoGW4sxRPMpr4o7Ka9J72JJetqqothP4KzHof',
      );
      expect(verified).toBe(true);
    });

    it('verify secp256k1', async () => {
      const { bytes, magicBytes, prefixSig } = await cryptoUtils.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_SECP256K1,
        magicBytesMap.generic,
      );
      const verified = await cryptoUtils.verify(
        `${magicBytes}${bytes}`,
        prefixSig,
        'sppk7cqnSb5pGaJYtoWX1tK1SiRJoCD2ucviYN3V4NbTcWcs9ycBhBg',
      );
      expect(verified).toBe(true);
    });

    it('verify p256', async () => {
      const { bytes, magicBytes, prefixSig } = await cryptoUtils.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_P256,
        magicBytesMap.generic,
      );
      const verified = await cryptoUtils.verify(
        `${magicBytes}${bytes}`,
        prefixSig,
        'p2pk66j3SVx5k2gaj5RqWowNcKGegA2yas8MswNhSHGUVC4NC3WkHy4',
      );
      expect(verified).toBe(true);
    });

    it('verify invalid p256', async () => {
      const { bytes, magicBytes, prefixSig } = await cryptoUtils.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        KEY_P256,
        magicBytesMap.generic,
      );

      const verified = await cryptoUtils.verify(
        `${magicBytes}${bytes}`,
        prefixSig,
        'p2pk67RwD3PTiuL9hzw7UMjivMLsMCmfcgqaCd6doYKEXPjNR7xsram',
      );

      expect(verified).toBe(false);
    });

    it('verify p256 producing signature that needs padding', async () => {
      const { bytes, magicBytes, prefixSig } = await cryptoUtils.sign(
        '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a915a26275e6880b9a6c02a2dea17733a2ef2685e5511bd3f160fd510fea7db50edd8122997800c0843d016910882a9436c31ce1d51570e21ae277bb8d91b800006c02a2dea17733a2ef2685e5511bd3f160fd510fea7df416de812294cd010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0032034f034d031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dd016df8122a6ca010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff020000003e02000000390320053d036d0743035d0100000024747a3161575850323337424c774e484a6343443462334475744365766871713254315a390346034e031b6c02a2dea17733a2ef2685e5511bd3f160fd510fea7dc916e08122dec9010000016910882a9436c31ce1d51570e21ae277bb8d91b800ff0200000013020000000e0320053d036d053e035d034e031b',
        'p2sk2ke47zhFz3znRZj39TW5KKS9VgfU1Hax7KeErgnShNe9oQFQUP',
        magicBytesMap.generic,
      );
      const verified = await cryptoUtils.verify(
        `${magicBytes}${bytes}`,
        prefixSig,
        'p2pk67RwD3PTiuL9hzw7UMjivMLsMCmfcgqaCd6doYKEXPjNR7xsram',
      );
      expect(verified).toBe(true);
    });
  });
});
