import React from 'react';
import { useDashboardSummary, useLowStockAlerts } from '../features/dashboard/dashboardHooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IndianRupee, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: lowStock, isLoading: isStockLoading } = useLowStockAlerts();

  if (isSummaryLoading || isStockLoading) {
     return <div className="flex h-full items-center justify-center">Loading Metrics...</div>;
  }

  const { dailySales, topProducts } = summary || {};
  const todayRevenue = dailySales?.totalRevenue || 0;
  const todayOrders = dailySales?.totalOrders || 0;

  return (
    <div className="space-y-6">
      {/* Quick Launch POS Button */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back!</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening in your store today.</p>
        </div>
        <Link 
          to="/pos" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Open POS Screen
        </Link>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{Number(todayRevenue).toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Sales Total</CardTitle>
            <ShoppingBag className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todayOrders} Invoices</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-2">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Low Stock Alerts</CardTitle>
            <AlertTriangle className={lowStock?.length > 0 ? "h-4 w-4 text-rose-500" : "h-4 w-4 text-green-500"} />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-gray-900">
               {lowStock?.length || 0} Items
             </div>
             <p className="text-xs text-muted-foreground mt-1">
                {lowStock?.length > 0 ? 'Requires immediate purchasing.' : 'All stock levels are optimal.'}
             </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Data Grids */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Products</CardTitle>
            <CardDescription>Items driving the most volume today.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {topProducts?.map((item, i) => (
                 <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex flex-col">
                      <span className="font-medium">{item?.product?.name}</span>
                      <span className="text-xs text-gray-500">SKU: {item?.product?.sku}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold">{item?.totalSold} Sold</span>
                      <span className="text-xs text-emerald-600">₹{Number(item?.totalRevenue).toLocaleString('en-IN')}</span>
                    </div>
                 </div>
               ))}
               {!topProducts?.length && <div className="text-sm text-gray-500">No sales recorded yet.</div>}
             </div>
          </CardContent>
        </Card>

         <Card className="lg:col-span-3 shadow-sm border-rose-100">
          <CardHeader className="bg-rose-50/50 rounded-t-xl border-b border-rose-100">
            <CardTitle className="text-lg text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Low Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
             <div className="space-y-4">
               {lowStock?.slice(0,5).map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item?.product?.name}</p>
                      <p className="text-xs text-gray-500">Min: {item?.low_stock_threshold}</p>
                    </div>
                    <div className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded">
                      {item.quantity} In Stock
                    </div>
                 </div>
               ))}
               {!lowStock?.length && <div className="text-sm text-gray-500">No low stock items.</div>}
             </div>
             <Link to="/dashboard/products" className="block mt-4 text-sm text-indigo-600 font-medium hover:underline">
               Manage Inventory →
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
