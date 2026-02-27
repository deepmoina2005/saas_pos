/**
 * Auth API — /api/v1/auth
 * POST /login       → { email, password }
 * POST /register    → { businessName, userName, email, password, gstin, address, state }
 */
import api from '@/app/axios';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};
