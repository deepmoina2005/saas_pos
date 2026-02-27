import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../auth/authSlice';
import { useTenant, useUpdateTenant } from './tenantHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, FileText, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function BusinessSettings() {
  const user = useSelector(selectAuthUser);
  const { data: tenant, isLoading } = useTenant(user?.tenant_id);
  const updateMutation = useUpdateTenant();

  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        gstin: tenant.gstin || '',
        phone: tenant.phone || '',
        address: tenant.address || ''
      });
    }
  }, [tenant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: user.tenant_id, data: formData }, {
      onSuccess: () => {
        toast.success("Settings Updated", {
           description: "Your business profile has been saved successfully.",
        });
      },
      onError: (error) => {
        toast.error("Update Failed", {
           description: error.response?.data?.message || "There was an error updating your settings.",
        });
      }
    });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center italic text-slate-500"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading business profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Business Profile</h1>
        <p className="text-slate-500 mt-1">Manage your brand identity and legal registration details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-lg">General Information</CardTitle>
               <CardDescription>This information will appear on your invoices.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Business / Store Name *</label>
                     <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                           required
                           className="pl-10 h-11"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">GSTIN (Registration Number)</label>
                     <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                           className="pl-10 h-11"
                           placeholder="e.g. 07AAAAA0000A1Z5"
                           value={formData.gstin}
                           onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                     <Input 
                        className="pl-10 h-11"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Business Address</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                     <textarea 
                        className="w-full min-h-[100px] pl-10 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Complete postal address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                     />
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="flex justify-end">
            <Button 
               type="submit" 
               className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-base font-bold gap-2 shadow-lg shadow-indigo-100"
               disabled={updateMutation.isPending}
            >
               {updateMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
               ) : (
                  <><Save className="w-5 h-5" /> Save Changes</>
               )}
            </Button>
         </div>
      </form>
    </div>
  );
}
