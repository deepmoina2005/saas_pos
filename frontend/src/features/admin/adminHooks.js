/**
 * Admin React Query Hooks
 * Tenant list + status toggle wired to real backend tenantAPI
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantAPI } from '../tenants/tenantAPI';
import { reportAPI } from '../reports/reportAPI';
import { toast } from "sonner";

export const useAdminTenants = () =>
  useQuery({
    queryKey: ['adminTenants'],
    queryFn: () => tenantAPI.getAll(),
    retry: 1,
  });

export const useAdminAnalytics = () => {
  const { data: tenants } = useAdminTenants();
  
  return useQuery({
    queryKey: ['adminAnalytics', tenants?.length],
    queryFn: async () => {
      const [dailySales, topProducts] = await Promise.allSettled([
        reportAPI.getDailySales(),
        reportAPI.getTopProducts(),
      ]);
      
      const tenantCount = tenants?.length || 0;
      const totalRevenue = dailySales.status === 'fulfilled' ? Number(dailySales.value?.totalRevenue || 0) : 0;

      return {
        activeTenants: tenantCount,
        mrr: totalRevenue * 0.1, // Simulated platform fee for demo
        churnRate: '0.0%',
        topPlans: [
          { name: 'SaaS Platform', count: tenantCount },
        ],
        revenueTrends: [
          { month: 'Last', revenue: totalRevenue },
          { month: 'Current', revenue: totalRevenue },
        ],
      };
    },
    enabled: !!tenants,
    retry: 1,
  });
};

export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }) => tenantAPI.update(id, { is_active }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminTenants'] });
      toast.success(variables.is_active ? "Tenant Activated" : "Tenant Suspended", {
         description: `Account access has been ${variables.is_active ? 'restored' : 'restricted'}.`,
      });
    },
    onError: (error) => {
       toast.error("Update Failed", {
          description: error.response?.data?.message || "Error changing tenant status.",
       });
    }
  });
};
