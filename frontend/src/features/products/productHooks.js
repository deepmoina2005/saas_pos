import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from './productAPI';
import { toast } from 'sonner';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productAPI.getAll(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productAPI.getCategories(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product Added", { description: "Inventory item has been successfully created." });
    },
    onError: (error) => {
       toast.error("Failed to Add Product", { description: error.response?.data?.message || "Error adding inventory item." });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product Updated", { description: "Inventory item modifications saved." });
    },
    onError: (error) => {
       toast.error("Update Failed", { description: error.response?.data?.message || "Error modifying product." });
    }
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category Created", { description: "New product category is now active." });
    },
    onError: (error) => {
       toast.error("Category Error", { description: error.response?.data?.message || "Could not create category." });
    }
  });
};
