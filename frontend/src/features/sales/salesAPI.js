/**
 * Sales API — /api/v1/sales
 * POST   /checkout              → process POS checkout
 *   Body: { items: [{ productId, quantity }], paymentMode, discount, isIntraState }
 *   Returns: { sale, invoiceNumber }
 *
 * GET    /                      → list sales history    [OWNER, MANAGER]
 *
 * GET    /invoice/:id           → get invoice details   [OWNER, MANAGER, CASHIER]
 */
import api from '@/app/axios';

export const salesAPI = {
  checkout: (cartData) => api.post('/sales/checkout', cartData),
  getHistory: () => api.get('/sales'),
  getInvoice: (id) => api.get(`/sales/invoice/${id}`),
};
