import axios from 'axios';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock auth store
jest.mock('../stores/auth');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store getState
    (useAuthStore.getState as jest.Mock).mockReturnValue({
      token: 'test-token',
      logout: jest.fn(),
    });
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header if token exists', async () => {
      const mockConfig = { headers: {} };

      // Get the request interceptor
      const interceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];

      if (typeof interceptor === 'function') {
        const result = await interceptor(mockConfig);
        expect(result.headers.Authorization).toBe('Bearer test-token');
      }
    });

    it('should not add Authorization header if no token', async () => {
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token: null,
        logout: jest.fn(),
      });

      const mockConfig = { headers: {} };

      const interceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];

      if (typeof interceptor === 'function') {
        const result = await interceptor(mockConfig);
        expect(result.headers.Authorization).toBeUndefined();
      }
    });
  });

  describe('Response Interceptor', () => {
    it('should return successful responses unchanged', async () => {
      const mockResponse = { data: { success: true }, status: 200 };

      const successInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][0];

      if (typeof successInterceptor === 'function') {
        const result = await successInterceptor(mockResponse);
        expect(result).toEqual(mockResponse);
      }
    });

    it('should logout on 401 error', async () => {
      const mockLogout = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token: 'test-token',
        logout: mockLogout,
      });

      const mockError = {
        response: { status: 401 },
        config: { url: '/api/data' },
      };

      const errorInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];

      if (typeof errorInterceptor === 'function') {
        await expect(errorInterceptor(mockError)).rejects.toEqual(mockError);
        expect(mockLogout).toHaveBeenCalled();
      }
    });

    it('should not logout on 401 for login/register endpoints', async () => {
      const mockLogout = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token: 'test-token',
        logout: mockLogout,
      });

      const mockError = {
        response: { status: 401 },
        config: { url: '/api/auth/login' },
      };

      const errorInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];

      if (typeof errorInterceptor === 'function') {
        await expect(errorInterceptor(mockError)).rejects.toEqual(mockError);
        expect(mockLogout).not.toHaveBeenCalled();
      }
    });

    it('should pass through non-401 errors', async () => {
      const mockError = {
        response: { status: 500 },
        config: { url: '/api/data' },
      };

      const errorInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];

      if (typeof errorInterceptor === 'function') {
        await expect(errorInterceptor(mockError)).rejects.toEqual(mockError);
      }
    });
  });

  describe('API Instance', () => {
    it('should have correct base URL', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:8080');
    });

    it('should have correct content type header', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
});
