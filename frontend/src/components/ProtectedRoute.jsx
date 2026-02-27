import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role?.name)) {
    // Determine fallback based on role
    if (user?.role?.name === 'SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
    if (user?.role?.name === 'CASHIER') return <Navigate to="/pos" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
