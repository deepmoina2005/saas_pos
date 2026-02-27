import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUpdateTenantStatus } from '../adminHooks';

export default function TenantManagementTable({ tenants }) {
  const updateStatus = useUpdateTenantStatus();

  const handleStatusToggle = (tenantId, currentStatus) => {
     updateStatus.mutate({ id: tenantId, is_active: !currentStatus });
  };

  if (!tenants) return null;

  return (
    <Card className="shadow-sm border-slate-200 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
           <CardTitle className="text-lg text-slate-800">Recent Tenants</CardTitle>
           <CardDescription>Manage businesses subscribed to the platform</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All Tenants</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Business Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} className="group">
                <TableCell className="font-medium text-slate-900">{tenant.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                     {tenant.subscription?.name || 'Trial'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">{tenant.gstin || 'N/A'}</TableCell>
                <TableCell>
                  {tenant.is_active ? (
                     <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900">Active</Badge>
                  ) : (
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">Suspended</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                   <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleStatusToggle(tenant.id, tenant.is_active)}
                      disabled={updateStatus.isPending && updateStatus.variables?.id === tenant.id}
                      className={tenant.is_active ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}
                   >
                     {tenant.is_active ? 'Suspend' : 'Activate'}
                   </Button>
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 && (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-6 text-slate-500">No tenants registered yet.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
