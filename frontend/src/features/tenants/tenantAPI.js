/**
 * Tenants API — /api/v1/tenants
 * GET    /          → all tenants        [SUPER_ADMIN]
 * GET    /:id       → tenant by id       [authenticated]
 * PATCH  /:id       → update tenant      [SUPER_ADMIN, OWNER] { name?, gstin?, address?, is_active? }
 */
import api from '@/app/axios';

export const tenantAPI = {
  getAll: () => api.get('/tenants'),
  getById: (id) => api.get(`/tenants/${id}`),
  update: (id, data) => api.patch(`/tenants/${id}`, data),
};
