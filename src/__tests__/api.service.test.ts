import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';

jest.mock('expo-secure-store');

// The real axios instance runs with a stub adapter, so both interceptors
// execute exactly as they do in the app, without any network access.
function respondWith(status: number): jest.MockedFunction<AxiosAdapter> {
  const adapter = jest.fn(async (config: InternalAxiosRequestConfig) => {
    const response: AxiosResponse = {
      data: { ok: status < 400 },
      status,
      statusText: String(status),
      headers: {},
      config,
    };
    if (status >= 400) {
      throw new AxiosError('Request failed', String(status), config, null, response);
    }
    return response;
  });
  api.defaults.adapter = adapter;
  return adapter;
}

describe('API Service', () => {
  let logoutSpy: jest.SpyInstance;

  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    logoutSpy = jest.spyOn(useAuthStore.getState(), 'logout').mockResolvedValue(undefined);
  });

  afterEach(() => {
    logoutSpy.mockRestore();
  });

  describe('request interceptor', () => {
    it('adds a Bearer token when the store has one', async () => {
      useAuthStore.setState({ token: 'test-token' });
      const adapter = respondWith(200);

      await api.get('/profile');

      const sent = adapter.mock.calls[0]![0];
      expect(sent.headers.Authorization).toBe('Bearer test-token');
    });

    it('sends no Authorization header without a token', async () => {
      const adapter = respondWith(200);

      await api.get('/profile');

      const sent = adapter.mock.calls[0]![0];
      expect(sent.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('returns successful responses unchanged', async () => {
      respondWith(200);

      const response = await api.get('/profile');

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ ok: true });
      expect(logoutSpy).not.toHaveBeenCalled();
    });

    it('logs out and rejects on a 401', async () => {
      useAuthStore.setState({ token: 'expired-token' });
      respondWith(401);

      await expect(api.get('/profile')).rejects.toMatchObject({ response: { status: 401 } });
      expect(logoutSpy).toHaveBeenCalledTimes(1);
    });

    it.each(['/auth/login', '/auth/register'])(
      'does not log out on a 401 from %s (wrong credentials)',
      async (path) => {
        respondWith(401);

        await expect(api.post(path, {})).rejects.toMatchObject({ response: { status: 401 } });
        expect(logoutSpy).not.toHaveBeenCalled();
      }
    );

    it('still logs out on a 401 from a route that only shares the prefix', async () => {
      respondWith(401);

      await expect(api.get('/auth/login-history')).rejects.toMatchObject({
        response: { status: 401 },
      });
      expect(logoutSpy).toHaveBeenCalledTimes(1);
    });

    it('ignores the query string when matching auth attempts', async () => {
      respondWith(401);

      await expect(api.post('/auth/login?next=%2Fprofile', {})).rejects.toMatchObject({
        response: { status: 401 },
      });
      expect(logoutSpy).not.toHaveBeenCalled();
    });

    it('rejects other errors without logging out', async () => {
      respondWith(500);

      await expect(api.get('/profile')).rejects.toMatchObject({ response: { status: 500 } });
      expect(logoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('configuration', () => {
    it('sends JSON', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('defaults the base URL for local development', () => {
      expect(api.defaults.baseURL).toBe(
        process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'
      );
    });
  });
});
