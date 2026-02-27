import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthUser } from '@/features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
  { name: 'Tenants', path: '/super-admin/tenants', icon: Building2 },
  { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: CreditCard },
  { name: 'System Settings', path: '/super-admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div className={cn("transition-all duration-300", !isSidebarOpen && "hidden")}>
          <h1 className="text-xl font-black tracking-tighter text-white font-outfit">ANTIGRAVITY</h1>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Super Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === item.path 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-white")} />
            <span className={cn("font-medium text-sm transition-all", !isSidebarOpen && "hidden")}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={cn("flex items-center gap-3 p-3 mb-4 rounded-xl bg-slate-800/50", !isSidebarOpen && "justify-center px-0")}>
           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-slate-700">
              {user?.name?.[0]?.toUpperCase() || 'A'}
           </div>
           <div className={cn("flex-1 min-w-0 transition-all", !isSidebarOpen && "hidden")}>
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
           </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-slate-400 hover:text-white hover:bg-rose-500/10 hover:text-rose-400 transition-all",
            !isSidebarOpen && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className={cn(!isSidebarOpen && "hidden")}>Logout</span>
        </Button>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-20 -right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center hover:text-white transition-colors hidden md:flex"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:block transition-all duration-300 relative z-20",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-900 z-40 transition-transform duration-300 md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <button className="md:hidden p-2 -ml-2 text-slate-500" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Status</p>
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
