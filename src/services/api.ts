import axios from 'axios';
import { useAuthStore } from '../stores/auth';

// Replace with your actual API URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// axios.create is the documented way to build an instance.
// eslint-disable-next-line import/no-named-as-default-member
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_ATTEMPT_PATHS = ['/auth/login', '/auth/register'];

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // A 401 from login or register means bad credentials, not an expired
    // session, so only other endpoints sign the user out.
    // Exact match (query string ignored), so a route such as
    // /auth/login-history still signs the user out on a 401.
    const path = (error.config?.url ?? '').split('?')[0];
    const isAuthAttempt = AUTH_ATTEMPT_PATHS.includes(path);
    if (error.response?.status === 401 && !isAuthAttempt) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { api };

// API methods
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
