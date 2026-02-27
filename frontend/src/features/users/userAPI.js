/**
 * Users (Staff) API — /api/v1/users
 * GET    /          → list tenant users  [OWNER, MANAGER]
 * POST   /          → create user        [OWNER, MANAGER]  { name, email, password, role_id }
 * PATCH  /:id       → update user        [OWNER, MANAGER]  { name?, is_active?, role_id? }
 */
import api from '@/app/axios';

export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
};
