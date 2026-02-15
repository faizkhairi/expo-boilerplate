import { renderHook, act } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../stores/auth';

// Mock expo-secure-store
jest.mock('expo-secure-store');

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should save token and user to secure store', async () => {
      const { result } = renderHook(() => useAuthStore());

      const mockToken = 'test-token';
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', mockToken);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_user', JSON.stringify(mockUser));
    });

    it('should update store state after login', async () => {
      const { result } = renderHook(() => useAuthStore());

      const mockToken = 'test-token';
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

      await act(async () => {
        await result.current.login(mockToken, mockUser);
      });

      expect(result.current.token).toBe(mockToken);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should throw error if SecureStore fails', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useAuthStore());

      const mockToken = 'test-token';
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

      await expect(result.current.login(mockToken, mockUser)).rejects.toThrow('Storage error');
    });
  });

  describe('logout', () => {
    it('should clear token and user from secure store', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set up authenticated state
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      await act(async () => {
        await result.current.login('test-token', mockUser);
      });

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user');
    });

    it('should clear store state after logout', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set up authenticated state
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      await act(async () => {
        await result.current.login('test-token', mockUser);
      });

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.token).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not throw if SecureStore fails during logout', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Delete error'));

      const { result } = renderHook(() => useAuthStore());

      await expect(result.current.logout()).resolves.not.toThrow();
    });
  });

  describe('loadToken', () => {
    it('should load token and user from secure store', async () => {
      const mockToken = 'stored-token';
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === 'auth_token') return Promise.resolve(mockToken);
        if (key === 'auth_user') return Promise.resolve(JSON.stringify(mockUser));
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadToken();
      });

      expect(result.current.token).toBe(mockToken);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle missing token gracefully', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadToken();
      });

      expect(result.current.token).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors during token load', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Load error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadToken();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.token).toBeNull();
    });
  });
});
