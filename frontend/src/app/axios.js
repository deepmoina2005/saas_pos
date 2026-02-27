/**
 * Central Axios API Client
 * - Auto attaches JWT Bearer token from Redux store
 * - Auto logs out on 401 Unauthorized
 * - Uses VITE_API_URL from .env
 */
import axios from 'axios';
import { store } from '@/store/store';
import { logout } from '@/features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// REQUEST: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE: auto-logout on 401
api.interceptors.response.use(
  (response) => response.data, // unwrap .data so callers get payload directly
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    // Normalise error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
