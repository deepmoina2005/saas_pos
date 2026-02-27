import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers, useUpdateUser } from './userHooks';
import { STAFF_ROLES } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: users, isLoading } = useUsers();
  const updateMutation = useUpdateUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Only if they want to change it
    role_id: 4,
    is_active: true
  });

  useEffect(() => {
    if (users && id) {
      const user = users.find(u => u.id === Number(id));
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '',
          role_id: user.role_id,
          is_active: user.is_active
        });
      }
    }
  }, [users, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatePayload = { ...formData };
    if (!updatePayload.password) delete updatePayload.password;

    updateMutation.mutate({ id: Number(id), data: updatePayload }, {
      onSuccess: () => navigate('/users'),
    });
  };

  if (isLoading) return <div className="p-8">Loading user details...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/users')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Staff List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Staff Member</CardTitle>
          <CardDescription>Update name, role, or reset password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password (Leave blank to keep current)</label>
              <Input 
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update User'}
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
            {updateMutation.isError && (
              <p className="text-sm text-red-500 text-center">{updateMutation.error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
