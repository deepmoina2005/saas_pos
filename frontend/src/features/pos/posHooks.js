/**
 * POS React Query Hooks
 * Products fetch + checkout mutation wired to real backend APIs
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../products/productAPI';
import { salesAPI } from '../sales/salesAPI';
import { toast } from "sonner";

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: () => productAPI.getAll(),
    retry: 1,
  });

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartData) => salesAPI.checkout(cartData),
    onSuccess: (data) => {
      // Invalidate products to get refreshed stock levels
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStock'] });
      queryClient.invalidateQueries({ queryKey: ['salesSummary'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      
      toast.success("Sale Successful!", {
         description: `Invoice ${data.invoiceNumber || 'generated'} completed successfully.`,
      });
    },
    onError: (error) => {
       toast.error("Checkout Error", {
          description: error.response?.data?.message || "There was a problem processing the sale.",
       });
    }
  });
};
