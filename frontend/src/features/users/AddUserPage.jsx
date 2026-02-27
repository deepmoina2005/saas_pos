import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from './userHooks';
import { STAFF_ROLES } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

export default function AddUserPage() {
  const navigate = useNavigate();
  const createMutation = useCreateUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: STAFF_ROLES[1].id, // Default to CASHIER
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => navigate('/users'),
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/users')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Staff List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Staff Member</CardTitle>
          <CardDescription>Create a new account for your store staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                required
                placeholder="Staff Member Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                required
                type="email"
                placeholder="staff@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Password</label>
              <Input 
                required
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Create User'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/users')}
              >
                Cancel
              </Button>
            </div>
            {createMutation.isError && (
              <p className="text-sm text-red-500 text-center">{createMutation.error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
