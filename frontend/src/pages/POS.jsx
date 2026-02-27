import React from 'react';
import { useProducts } from '../features/pos/posHooks';
import POSProductGrid from '../features/pos/components/POSProductGrid';
import POSCartPane from '../features/pos/components/POSCartPane';
import { LogOut, LayoutDashboard, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser, logout } from '../features/auth/authSlice';

export default function POS() {
  const { data: products, isLoading } = useProducts();
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-20 text-white shrink-0 shadow-sm">
         <div className="flex items-center gap-4">
             <span className="text-xl font-bold tracking-tight text-indigo-400">POS<span className="text-white">Genius</span></span>
             <div className="h-5 w-px bg-slate-700 mx-2 hidden sm:block"></div>
             <span className="text-sm font-medium text-slate-300 hidden sm:block bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                 Till #1 — Active
             </span>
         </div>
         
         <div className="flex items-center gap-4">
            <Link 
               to="/dashboard" 
               className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md transition-colors"
            >
               <LayoutDashboard className="w-4 h-4" />
               <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
               <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-100">{user?.name}</span>
                  <span className="text-xs text-rose-400 font-medium tracking-wider uppercase">{user?.role?.name}</span>
               </div>
               <button onClick={handleLogout} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 rounded-md transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
         </div>
      </header>

      {/* Main Dual-Pane POS Interface */}
      <div className="flex flex-1 overflow-hidden relative">
         {/* Left Side: Product Catalog (takes remaining space) */}
         <div className="flex-1 overflow-hidden h-full z-0 flex rounded-tl-xl border-t border-l border-slate-800/50 ml-2 mt-2 bg-white shadow-2xl">
             <POSProductGrid products={products} isLoading={isLoading} />
         </div>

         {/* Right Side: Cart & Checkout (Fixed width) */}
         <POSCartPane />
      </div>
    </div>
  );
}
