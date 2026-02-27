import React from 'react';
import { 
  Building2, 
  Users, 
  LayoutDashboard as Activity, 
  CreditCard as TrendingUp, 
  ChevronRight as ArrowUpRight, 
  ChevronLeft as ArrowDownRight,
  Menu as Plus,
  X as RefreshCcw,
  LogOut as ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useAdminTenants, useAdminAnalytics } from '../features/admin/adminHooks';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { data: tenants, isLoading: isTenantsLoading, refetch: refetchTenants } = useAdminTenants();
  const { data: analytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useAdminAnalytics();

  const handleRefresh = () => {
    refetchTenants();
    refetchAnalytics();
  };

  if (isTenantsLoading || isAnalyticsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Synchronizing platform data...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    { 
      label: 'Active Tenants', 
      value: analytics?.activeTenants || 0, 
      icon: Building2, 
      color: 'bg-indigo-500', 
      trend: '+12%', 
      trendUp: true 
    },
    { 
      label: 'New Registrations', 
      value: tenants?.filter(t => new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0, 
      icon: Users, 
      color: 'bg-sky-500', 
      trend: '+40%', 
      trendUp: true 
    },
    { 
      label: 'Platform Revenue', 
      value: `₹${(analytics?.mrr || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-emerald-500', 
      trend: '+8%', 
      trendUp: true 
    },
    { 
      label: 'Churn Rate', 
      value: '0.0%', 
      icon: Activity, 
      color: 'bg-rose-500', 
      trend: '-2%', 
      trendUp: false 
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Platform Overview</h1>
          <p className="text-slate-500 font-medium">Global analytics and tenant management for Antigravity POS.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} className="bg-white border-slate-200">
             <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => navigate('/super-admin/tenants/new')} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
             <Plus className="w-4 h-4 mr-2" /> New Tenant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group">
            <CardContent className="p-0">
               <div className="flex items-stretch h-32">
                  <div className={cn("w-2", kpi.color)} />
                  <div className="flex-1 p-6 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                        <div className={cn(
                           "flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-full",
                           kpi.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                           {kpi.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                           {kpi.trend}
                        </div>
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-outfit">{kpi.value}</span>
                     </div>
                  </div>
                  <div className="p-6 flex items-center opacity-10 group-hover:opacity-20 transition-opacity">
                     <kpi.icon className="w-12 h-12" />
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
               <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-bold">Revenue Growth</CardTitle>
                    <CardDescription>Platform fee collection trends over time.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100">Monthly</Badge>
               </div>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.revenueTrends || []}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{fontWeight: 'bold', fontSize: '12px'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
               <CardTitle className="text-lg font-bold">Recent Registrations</CardTitle>
               <CardDescription>Latest tenants to join the platform.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-6">
                  {tenants?.slice(0, 5).map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/super-admin/tenants/${tenant.id}`)}>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                             {tenant.name[0].toUpperCase()}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-800">{tenant.name}</p>
                             <p className="text-xs text-slate-400 capitalize">{tenant.subscription_plan || 'Basic'}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <Badge className={tenant.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}>
                             {tenant.is_active ? 'Active' : 'Paused'}
                          </Badge>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">2 hours ago</p>
                       </div>
                    </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-6 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-sm" onClick={() => navigate('/super-admin/tenants')}>
                  View All Tenants <ArrowUpRight className="w-4 h-4 ml-1" />
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
