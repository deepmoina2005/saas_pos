/**
 * Reports API — /api/v1/reports
 * GET /dashboard            → combined daily metrics + top products + low stock
 * GET /daily-sales          → { totalRevenue, totalOrders, totalDiscounts }
 * GET /tax-summary?start=&end=  → { totalCgst, totalSgst, totalIgst }
 * GET /inventory-valuation  → { totalValue }
 * GET /top-products         → top 5 products by volume
 */
import api from '@/app/axios';

export const reportAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getDailySales: () => api.get('/reports/daily-sales'),
  getTaxSummary: (startDate, endDate) =>
    api.get('/reports/tax-summary', { params: { startDate, endDate } }),
  getInventoryValuation: () => api.get('/reports/inventory-valuation'),
  getTopProducts: () => api.get('/reports/top-products'),
};
