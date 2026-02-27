import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionOverview({ topPlans }) {
  if (!topPlans || !topPlans.length) return null;

  return (
    <Card className="col-span-1 shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800">Plan Distribution</CardTitle>
        <CardDescription>Breakdown of active subscriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          {topPlans.map((plan, i) => (
             <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                     {plan.name.charAt(0)}
                   </div>
                   <span className="font-medium text-slate-700">{plan.name}</span>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  {plan.count} Subscribers
                </Badge>
             </div>
          ))}
      </CardContent>
    </Card>
  );
}
