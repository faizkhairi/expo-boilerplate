import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

function loadFor(os: 'ios' | 'web') {
  let mod!: typeof import('./secureStorage');
  jest.isolateModules(() => {
    jest.doMock('react-native', () => ({ Platform: { OS: os } }));
    mod = jest.requireActual('./secureStorage');
  });
  return mod.secureStorage;
}

describe('secureStorage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.dontMock('react-native');
  });

  describe('on native', () => {
    it('reads, writes and deletes through expo-secure-store', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored');
      const storage = loadFor('ios');

      await storage.setItem('k', 'v');
      await expect(storage.getItem('k')).resolves.toBe('stored');
      await storage.deleteItem('k');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('k', 'v');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('k');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('k');
    });
  });

  describe('on web', () => {
    const original = globalThis.localStorage;
    let store: Map<string, string>;

    beforeEach(() => {
      store = new Map();
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
          removeItem: (k: string) => void store.delete(k),
        },
      });
    });

    afterEach(() => {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: original });
    });

    it('uses localStorage because expo-secure-store has no web implementation', async () => {
      const storage = loadFor('web');

      await storage.setItem('k', 'v');
      await expect(storage.getItem('k')).resolves.toBe('v');
      await storage.deleteItem('k');
      await expect(storage.getItem('k')).resolves.toBeNull();

      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
      expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
    });
  });
});
