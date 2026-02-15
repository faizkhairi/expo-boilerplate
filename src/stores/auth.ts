import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { logger } from '../utils/logger';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ token, user, isAuthenticated: true });

      logger.audit('USER_LOGIN', { userId: user.id, email: user.email });
    } catch (error) {
      logger.error('Error saving auth data', error as Error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { user } = get();

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      set({ token: null, user: null, isAuthenticated: false });

      if (user) {
        logger.audit('USER_LOGOUT', { userId: user.id });
      }
    } catch (error) {
      logger.error('Error clearing auth data', error as Error);
    }
  },

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({ token, user, isAuthenticated: true, isLoading: false });

        logger.audit('TOKEN_LOADED', { userId: user.id });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      logger.error('Error loading auth data', error as Error);
      set({ isLoading: false });
    }
  },
}));
