import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../auth/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Building2 } from 'lucide-react';

export default function ProfileSettings() {
  const user = useSelector(selectAuthUser);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal account settings and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-200 shadow-sm">
           <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                 <User className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                 {user?.role?.name || 'User'}
              </Badge>
           </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 shadow-sm">
           <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Primary details associated with your login.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 font-outfit">
                 <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Mail className="w-5 h-5 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</p>
                    <p className="text-slate-700 font-medium">{user?.email}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 font-outfit">
                 <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Shield className="w-5 h-5 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Access Level</p>
                    <p className="text-slate-700 font-medium">{user?.role?.name}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 font-outfit">
                 <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Building2 className="w-5 h-5 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenant ID</p>
                    <p className="text-slate-700 font-medium">#{user?.tenant_id || 'Global'}</p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
