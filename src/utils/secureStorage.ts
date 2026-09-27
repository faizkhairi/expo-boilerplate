import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Key-value storage for auth data.
 *
 * iOS and Android use expo-secure-store (Keychain / Keystore). expo-secure-store
 * has no web implementation, so on web this falls back to localStorage, which
 * any script on the page can read. That is the usual trade-off for a web SPA;
 * if the web build matters for your app, prefer httpOnly cookies set by your API.
 */
const isWeb = Platform.OS === 'web';

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return globalThis.localStorage?.getItem(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async deleteItem(key: string): Promise<void> {
    if (isWeb) {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
