import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterPage from './features/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import OwnerDashboard from './pages/OwnerDashboard';

import SuperAdminDashboard from './pages/SuperAdminDashboard';
import POS from './pages/POS';
import InvoicePrintView from './pages/InvoicePrintView';

import UserListPage from './features/users/UserListPage';
import AddUserPage from './features/users/AddUserPage';
import EditUserPage from './features/users/EditUserPage';

import ProductListPage from './features/products/ProductListPage';
import AddProductPage from './features/products/AddProductPage';
import EditProductPage from './features/products/EditProductPage';
import CategoryManagementPage from './features/inventory/CategoryManagementPage';
import InventoryAdjustmentPage from './features/inventory/InventoryAdjustmentPage';
import SalesHistoryPage from './features/sales/SalesHistoryPage';
import TaxReportPage from './features/reports/TaxReportPage';
import InventoryReport from './features/reports/InventoryReport';
import ProfileSettings from './features/settings/ProfileSettings';
import BusinessSettings from './features/tenants/BusinessSettings';
import TenantListPage from './features/admin/pages/TenantListPage';
import CreateTenantPage from './features/admin/pages/CreateTenantPage';
import EditTenantPage from './features/admin/pages/EditTenantPage';
import SubscriptionPlansPage from './features/admin/pages/SubscriptionPlansPage';
import SystemSettingsPage from './features/admin/pages/SystemSettingsPage';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/super-admin" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="tenants" element={<TenantListPage />} />
          <Route path="tenants/new" element={<CreateTenantPage />} />
          <Route path="tenants/edit/:id" element={<EditTenantPage />} />
          <Route path="subscriptions" element={<SubscriptionPlansPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>

        {/* Tenant Owner / Manager Routes (Nested) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          
          {/* Staff Management */}
          <Route path="users" element={<UserListPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="users/edit/:id" element={<EditUserPage />} />

          {/* Product & Inventory Catalog */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="inventory/categories" element={<CategoryManagementPage />} />
          <Route path="inventory/stock/:id" element={<InventoryAdjustmentPage />} />

          {/* Sales & Performance */}
          <Route path="sales" element={<SalesHistoryPage />} />
          
          {/* Reporting */}
          <Route path="reports/tax" element={<TaxReportPage />} />
          <Route path="reports/inventory" element={<InventoryReport />} />

          {/* Global Settings */}
          <Route path="settings/profile" element={<ProfileSettings />} />
          <Route path="settings/business" element={<BusinessSettings />} />
        </Route>

        {/* POS Cashier Routes */}
        <Route 
          path="/pos/*" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'CASHIER']}>
              <POS />
            </ProtectedRoute>
          } 
        />

        {/* Invoice Print View */}
        <Route 
          path="/invoice/:id" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'CASHIER']}>
              <InvoicePrintView />
            </ProtectedRoute>
          } 
        />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
