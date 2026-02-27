import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, CreditCard, Activity } from 'lucide-react';

export default function SystemStatsCards({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Active Tenants</CardTitle>
          <Users className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{analytics.activeTenants}</div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center">
             <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Monthly Recurring (MRR)</CardTitle>
          <CreditCard className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">${analytics.mrr.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center">
             <TrendingUp className="h-3 w-3 mr-1" /> +4.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
          <Activity className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{analytics.churnRate}</div>
           <p className="text-xs text-slate-500 mt-1">
             Healthy &lt; 5%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
