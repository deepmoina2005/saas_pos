import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthUser } from '../features/auth/authSlice';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Pickaxe, Settings, LogOut, Building2 } from 'lucide-react';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'POS Screen', path: '/pos', icon: ShoppingCart },
    { name: 'Inventory & Catalog', path: '/dashboard/products', icon: Package },
    { name: 'Sales & History', path: '/dashboard/sales', icon: FileText },
    { name: 'Tax Reports', path: '/dashboard/reports/tax', icon: Pickaxe },
    { name: 'Staff Management', path: '/dashboard/users', icon: Users },
    { name: 'My Profile', path: '/dashboard/settings/profile', icon: Settings },
    { name: 'Business Settings', path: '/dashboard/settings/business', icon: Building2 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-indigo-400">POS<span className="text-white">Genius</span></span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-800 rounded-md">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium truncate max-w-[120px]">{user?.name}</span>
              <span className="text-xs text-slate-400">{user?.role?.name}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Placeholder Header - Could contain tenant name, date, fast actions */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-gray-800">Tenant Dashboard</h1>
            <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet /> {/* Renders sub-pages */}
        </div>
      </main>
    </div>
  );
}
