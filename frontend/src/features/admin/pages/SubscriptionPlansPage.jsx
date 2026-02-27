import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic Plan",
    price: "INR 999",
    billing: "per month",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    features: ["Up to 500 orders/mo", "2 Staff Accounts", "Basic Inventory", "Email Support"],
    popular: false,
    svg: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    name: "Pro Plan",
    price: "INR 2,499",
    billing: "per month",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
    features: ["Unlimited orders", "10 Staff Accounts", "Barcode Integration", "Advanced Reports", "Priority Support"],
    popular: true,
    svg: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )
  },
  {
    name: "Enterprise",
    price: "Custom",
    billing: "contact sales",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    features: ["Multi-outlet support", "API Access", "Custom Modules", "Dedicated Account Manager"],
    popular: false,
    svg: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

export default function SubscriptionPlansPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Subscription Catalog</h1>
          <p className="text-slate-500 font-medium">Define and manage plans available for businesses.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.svg;
          return (
            <Card key={plan.name} className={cn(
               "border-none shadow-2xl relative overflow-hidden",
               plan.popular ? "shadow-indigo-200 border-2 border-indigo-200 ring-4 ring-indigo-50" : "shadow-slate-100"
            )}>
              {plan.popular && (
                 <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-indigo-600 text-white border-none px-3 py-1 font-bold">Most Popular</Badge>
                 </div>
              )}
              <CardHeader className="p-8">
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border", plan.bgColor, plan.borderColor)}>
                    <Icon className={cn("w-7 h-7", plan.iconColor)} />
                 </div>
                 <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
                 <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-indigo-600 font-outfit">{plan.price}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{plan.billing}</span>
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="space-y-4">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                         </div>
                         <span className="text-sm font-medium text-slate-600">{feature}</span>
                      </div>
                    ))}
                 </div>
                 <div className="pt-4 flex flex-col gap-3">
                    <Button variant={plan.popular ? "default" : "outline"} className={cn("w-full h-12 font-bold", plan.popular && "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20")}>
                       Edit Plan Details
                    </Button>
                    <Button variant="ghost" className="text-xs font-bold text-slate-400 hover:text-slate-600">
                       View Subscribers 
                       <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </Button>
                 </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-indigo-900 text-white overflow-hidden">
         <div className="flex flex-col md:flex-row items-center p-8 gap-8">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20">
               <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="flex-1 text-center md:text-left">
               <h3 className="text-xl font-black">Plan Configuration</h3>
               <p className="text-indigo-200 font-medium">Global rules for tax, trials, and currency are managed in platform settings.</p>
            </div>
            <Button className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-8">
               Manage Rules
            </Button>
         </div>
      </Card>
    </div>
  );
}
