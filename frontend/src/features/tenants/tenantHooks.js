import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantAPI } from './tenantAPI';

export const useTenant = (id) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantAPI.getById(id),
    enabled: !!id,
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tenantAPI.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
