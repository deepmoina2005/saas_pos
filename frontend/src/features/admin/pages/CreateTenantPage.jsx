import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterTenant as useRegister } from '../../auth/authHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Inline Icons to avoid Lucide-React build-time crashes in Vite 7
const Icons = {
  Building: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ArrowLeft: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  User: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Mail: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Lock: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  MapPin: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ShieldCheck: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Spinner: (props) => (
    <svg {...props} className={cn("animate-spin", props.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
};

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    businessName: '',
    userName: '',
    email: '',
    password: '',
    gstin: '',
    address: '',
    state: 'Other'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({
      ...formData,
      name: formData.userName, // backend expects name for the user
      businessName: formData.businessName
    }, {
      onSuccess: () => {
        toast.success("Business Registered", { description: `${formData.businessName} has been onboarded.` });
        navigate('/super-admin/tenants');
      },
      onError: (err) => {
        toast.error("Registration Failed", { description: err.message || "Could not onboard new tenant." });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/super-admin/tenants')} className="text-slate-500 hover:text-indigo-600">
           <Icons.ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </div>

      <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Onboard New Tenant</h1>
          <p className="text-slate-500 font-medium">Create a new business unit and its primary administrator account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                     <Icons.Building className="w-4 h-4 text-indigo-500" /> Business Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Business Name *</label>
                     <Input 
                        required
                        placeholder="e.g. Acme Retailers"
                        className="h-11 border-slate-200"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">GSTIN Number</label>
                     <Input 
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        className="h-11 border-slate-200 uppercase"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Business Address</label>
                     <div className="relative">
                        <Icons.MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <textarea 
                           className="w-full min-h-[100px] pl-10 pr-3 py-2 rounded-md border border-slate-200 bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="Full registered address..."
                           value={formData.address}
                           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                     <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Icons.User className="w-4 h-4 text-emerald-500" /> Primary Administrator
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Owner Name *</label>
                        <div className="relative">
                           <Icons.User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                           <Input 
                              required
                              placeholder="Full Name"
                              className="pl-10 h-11 border-slate-200"
                              value={formData.userName}
                              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                        <div className="relative">
                           <Icons.Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                           <Input 
                              required
                              type="email"
                              placeholder="owner@business.com"
                              className="pl-10 h-11 border-slate-200"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Password *</label>
                        <div className="relative">
                           <Icons.Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                           <Input 
                              required
                              type="password"
                              placeholder="Minimum 8 characters"
                              className="pl-10 h-11 border-slate-200"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                     <Icons.ShieldCheck className="w-8 h-8 text-indigo-400" />
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Onboarding</p>
                        <p className="text-sm font-black">Final Step</p>
                     </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                     Pressing the button below will create the business entity and initialize the tenant account.
                  </p>
                  <Button 
                     type="submit" 
                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 shadow-lg shadow-indigo-600/20"
                     disabled={registerMutation.isPending}
                  >
                     {registerMutation.isPending ? <Icons.Spinner className="w-5 h-5 mr-2" /> : 'Confirm & Onboard Business'}
                  </Button>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
