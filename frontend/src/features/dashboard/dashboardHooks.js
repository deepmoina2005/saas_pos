/**
 * Dashboard React Query Hooks
 * Fetches real dashboard and low-stock data from the backend reports API
 */
import { useQuery } from '@tanstack/react-query';
import { reportAPI } from '../reports/reportAPI';
import { inventoryAPI } from '../inventory/inventoryAPI';

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => reportAPI.getDashboard(),
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  });

export const useLowStockAlerts = () =>
  useQuery({
    queryKey: ['lowStock'],
    queryFn: () => inventoryAPI.getLowStock(),
    retry: 1,
  });
