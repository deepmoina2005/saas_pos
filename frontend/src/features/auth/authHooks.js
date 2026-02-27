/**
 * Auth React Query Hooks
 * Wraps authAPI with React Query mutations for login and registration
 */
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './authAPI';
import { setCredentials, logout as logoutAction } from './authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));

      const roleName = data.user?.role?.name || data.user?.role;
      switch (roleName) {
        case 'SUPER_ADMIN': navigate('/super-admin'); break;
        case 'OWNER':
        case 'MANAGER':    navigate('/dashboard');    break;
        case 'CASHIER':    navigate('/pos');           break;
        default:           navigate('/login');
      }
    },
  });
};

export const useRegisterTenant = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: () => navigate('/login', { state: { message: 'Registration successful! Please login.' } }),
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return () => {
    dispatch(logoutAction());
    navigate('/login');
  };
};
