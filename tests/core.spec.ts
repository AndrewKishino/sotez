import { Sotez } from '../src';

describe('core', () => {
  let tez = new Sotez();

  beforeEach(() => {
    tez = new Sotez();
  });

  it('init params', () => {
    expect(tez.debugMode).toBe(false);
    expect(tez.provider).toBe('http://127.0.0.1:8732');
    expect(tez.chain).toBe('main');
    expect(tez.defaultFee).toBe(1420);
  });

  it('init options', () => {
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

  it('set provider', () => {
    expect(tez.provider).toBe('http://127.0.0.1:8732');
    tez.setProvider('http://127.0.0.1:8888');
    expect(tez.provider).toBe('http://127.0.0.1:8888');
  });
});
