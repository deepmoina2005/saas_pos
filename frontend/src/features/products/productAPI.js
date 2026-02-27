/**
 * Products & Categories API — /api/v1/inventory
 * GET    /categories            → list categories
 * POST   /categories            → create category      { name }
 * GET    /products              → list products (with inventory)
 * POST   /products              → create product       { name, sku?, barcode?, hsn_code?, base_price, tax_rate, is_tax_inclusive, category_id?, initial_quantity, low_stock_threshold }
 * PATCH  /products/:id          → update product info  { name?, base_price?, tax_rate?, ... }
 */
import api from '@/app/axios';

export const productAPI = {
  // Categories
  getCategories: () => api.get('/inventory/categories'),
  createCategory: (data) => api.post('/inventory/categories', data),

  // Products
  getAll: () => api.get('/inventory/products'),
  create: (data) => api.post('/inventory/products', data),
  update: (id, data) => api.patch(`/inventory/products/${id}`, data),
};
