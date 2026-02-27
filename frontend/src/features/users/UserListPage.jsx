import React from 'react';
import { useUsers, useUpdateUser } from './userHooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, UserX, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserListPage() {
  const { data: users, isLoading, isError } = useUsers();
  const updateMutation = useUpdateUser();

  const handleToggleStatus = (id, currentStatus) => {
    updateMutation.mutate({ id, data: { is_active: !currentStatus } });
  };

  if (isLoading) return <div className="p-8">Loading users...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading users.</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your store staff and their roles.</p>
        </div>
        <Button asChild>
          <Link to="/users/add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Staff Member
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role?.name || user.role_id}</Badge>
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" asChild title="Edit User">
                    <Link to={`/users/edit/${user.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    title={user.is_active ? "Deactivate User" : "Activate User"}
                  >
                    {user.is_active ? <UserX className="w-4 h-4 text-rose-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
