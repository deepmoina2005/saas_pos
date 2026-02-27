/**
 * Inventory API — /api/v1/inventory
 * PATCH  /products/:id/stock   → adjust stock quantity  { quantityDelta: number (+ or -) }
 * GET    /low-stock             → list products below threshold
 */
import api from '@/app/axios';

export const inventoryAPI = {
  updateStock: (productId, quantityDelta) =>
    api.patch(`/inventory/products/${productId}/stock`, { quantityDelta }),
  getLowStock: () => api.get('/inventory/low-stock'),
};
