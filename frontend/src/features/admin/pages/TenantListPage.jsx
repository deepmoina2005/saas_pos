import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAdminTenants, useUpdateTenantStatus } from '../adminHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TenantListPage() {
  const navigate = useNavigate();
  const { data: tenants, isLoading } = useAdminTenants();
  const updateStatus = useUpdateTenantStatus();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants?.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (id, currentStatus) => {
    updateStatus.mutate({ id, is_active: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Tenant Directory</h1>
          <p className="text-slate-500 font-medium">Manage all businesses and their platform access.</p>
        </div>
        <Button onClick={() => navigate('/super-admin/tenants/new')} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4 mr-2" /> Add New Business
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or GSTIN..." 
              className="pl-10 h-10 bg-slate-50 border-none ring-offset-transparent focus-visible:ring-1 focus-visible:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="h-10 text-slate-500 border-slate-200">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="w-[300px] py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-400">Business Details</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Subscription</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Created</TableHead>
                <TableHead className="text-right py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-b border-slate-50">
                    <TableCell className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 rounded" /></TableCell>
                    <TableCell><div className="h-6 w-24 bg-slate-100 rounded" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-slate-100 rounded" /></TableCell>
                    <TableCell><div className="h-6 w-32 bg-slate-100 rounded" /></TableCell>
                    <TableCell className="text-right px-6"><div className="h-8 w-8 bg-slate-100 rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTenants?.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100">
                        {tenant.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{tenant.name}</p>
                        <p className="text-xs text-slate-400">{tenant.gstin || 'No GSTIN registered'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <Badge variant="outline" className="w-fit bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] font-bold uppercase">
                         {tenant.subscription_plan || 'Pro Plan'}
                       </Badge>
                       <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Valid till 2025
                       </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tenant.is_active ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 border hover:bg-emerald-100 shadow-none gap-1 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-slate-100 border gap-1 py-1">
                        <XCircle className="w-3.5 h-3.5" /> Suspended
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-500">
                       {new Date(tenant.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl border-none">
                          <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5">Management</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/super-admin/tenants/edit/${tenant.id}`)} className="rounded-lg gap-2 cursor-pointer py-2">
                             <Edit2 className="w-4 h-4 text-slate-500" /> <span className="text-sm font-medium">Edit Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(tenant.id, tenant.is_active)} className="rounded-lg gap-2 cursor-pointer py-2">
                             {tenant.is_active ? (
                               <><XCircle className="w-4 h-4 text-rose-500" /> <span className="text-sm font-medium text-rose-600">Suspend Access</span></>
                             ) : (
                               <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-sm font-medium text-emerald-600">Activate Access</span></>
                             )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50 my-1" />
                          <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2 text-indigo-600">
                             <ExternalLink className="w-4 h-4" /> <span className="text-sm font-medium">Login as Admin</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredTenants?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 text-slate-300">
                           <Building2 className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-medium">No businesses found matching your search.</p>
                        <Button variant="link" onClick={() => setSearchTerm('')} className="text-indigo-600">Clear all filters</Button>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
