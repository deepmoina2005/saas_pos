import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from './userAPI';
import { toast } from "sonner";

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getAll(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Staff Member Created", { description: "New user has been successfully added to your team." });
    },
    onError: (error) => {
      toast.error("Creation Failed", { description: error.response?.data?.message || "Error adding staff member." });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Profile Updated", { description: "Staff member details have been updated." });
    },
    onError: (error) => {
      toast.error("Update Failed", { description: error.response?.data?.message || "Error updating staff member." });
    }
  });
};
