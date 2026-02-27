import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useCreateCategory } from '../products/productHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Tag, Plus } from 'lucide-react';

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    createMutation.mutate({ name: newCategory }, {
      onSuccess: () => setNewCategory(''),
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/dashboard/products')} className="mb-2 text-slate-500">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
      </Button>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          <p className="text-sm text-slate-500">Organize your products for better POS filtering.</p>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Create New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
             <Input 
               required
               placeholder="e.g. Electronics, Groceries..."
               value={newCategory}
               onChange={(e) => setNewCategory(e.target.value)}
             />
             <Button 
               type="submit" 
               disabled={createMutation.isPending}
               className="bg-indigo-600 hover:bg-indigo-700"
             >
               <Plus className="w-4 h-4 mr-2" />
               {createMutation.isPending ? 'Adding...' : 'Add'}
             </Button>
          </form>
          {createMutation.isError && (
             <p className="text-xs text-rose-500 mt-2">{createMutation.error.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
           <TableHeader className="bg-slate-50">
             <TableRow>
               <TableHead>Category Name</TableHead>
               <TableHead className="text-right">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {isLoading ? (
               <TableRow><TableCell colSpan={2} className="text-center py-4">Loading...</TableCell></TableRow>
             ) : categories?.map((cat) => (
               <TableRow key={cat.id}>
                  <TableCell className="font-medium text-slate-700">{cat.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600" disabled>
                      Delete
                    </Button>
                  </TableCell>
               </TableRow>
             ))}
             {categories?.length === 0 && (
                <TableRow><TableCell colSpan={2} className="text-center py-8 text-slate-400 italic">No categories created yet.</TableCell></TableRow>
             )}
           </TableBody>
        </Table>
      </div>
    </div>
  );
}
