import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenant, useUpdateTenant } from '../../tenants/tenantHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Save, ArrowLeft, Loader2, Globe, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id);
  const updateMutation = useUpdateTenant();

  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    phone: '',
    address: '',
    subscription_plan: '',
    is_active: true
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        gstin: tenant.gstin || '',
        phone: tenant.phone || '',
        address: tenant.address || '',
        subscription_plan: tenant.subscription_plan || 'Pro Plan',
        is_active: tenant.is_active ?? true
      });
    }
  }, [tenant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id, data: formData }, {
      onSuccess: () => {
        toast.success("Tenant Updated", { description: `${formData.name} profile has been successfully modified.` });
        navigate('/super-admin/tenants');
      },
      onError: (err) => {
        toast.error("Update Failed", { description: err.response?.data?.message || "Could not update tenant details." });
      }
    });
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center italic text-slate-500"><Loader2 className="w-6 h-6 animate-spin mr-3" /> Fetching tenant details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/super-admin/tenants')} className="text-slate-500 hover:text-indigo-600">
           <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </div>

      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Edit Business Profile</h1>
            <p className="text-slate-500 font-medium">Modify account settings and subscription status for {tenant?.name}.</p>
         </div>
         <Badge className={formData.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100 h-8 px-4" : "bg-rose-50 text-rose-600 border-rose-100 h-8 px-4"}>
            {formData.is_active ? 'Account Active' : 'Account Suspended'}
         </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
               <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                     <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-500" /> General Information
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Business Name *</label>
                        <Input 
                           required
                           className="h-11 border-slate-200"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">GSTIN / Registration</label>
                           <Input 
                              className="h-11 border-slate-200"
                              value={formData.gstin}
                              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Primary Contact</label>
                           <Input 
                              className="h-11 border-slate-200"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Registered Address</label>
                        <textarea 
                           className="w-full min-h-[100px] px-3 py-2 rounded-md border border-slate-200 bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                           value={formData.address}
                           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                     <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-sky-500" /> Platform Access
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-slate-800">Account Status</p>
                           <p className="text-xs text-slate-500">Enable or disable all users under this tenant.</p>
                        </div>
                        <button 
                           type="button"
                           onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                           className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                              formData.is_active ? "bg-indigo-600" : "bg-slate-300"
                           )}
                        >
                           <span className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              formData.is_active ? "translate-x-6" : "translate-x-1"
                           )} />
                        </button>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                     <CardTitle className="text-base font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500" /> Subscription
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">Current Plan</label>
                        <select 
                           className="w-full h-11 px-3 py-2 rounded-md border border-slate-200 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                           value={formData.subscription_plan}
                           onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                        >
                           <option value="Basic Plan">Basic Plan</option>
                           <option value="Pro Plan">Pro Plan</option>
                           <option value="Enterprise Plan">Enterprise Plan</option>
                        </select>
                     </div>
                     <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-2 text-emerald-700 mb-1">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-xs font-bold">Billing Active</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-medium italic">Next billing cycle: March 20, 2026</p>
                     </div>
                  </CardContent>
               </Card>

               <div className="p-5 rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-200 space-y-3">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-8 h-8 text-indigo-400" />
                     <div>
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest leading-none">Admin Action</p>
                        <p className="text-sm font-black">Verify Identity</p>
                     </div>
                  </div>
                  <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">
                     Changes to business credentials and GSTIN must be verified against official documents to maintain platform integrity.
                  </p>
                  <Button 
                     type="submit" 
                     className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-black h-11"
                     disabled={updateMutation.isPending}
                  >
                     {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Profile Changes'}
                  </Button>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
