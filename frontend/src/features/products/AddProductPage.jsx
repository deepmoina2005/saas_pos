import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct, useCategories } from './productHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from 'lucide-react';

export default function AddProductPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    hsn_code: '',
    base_price: '',
    tax_rate: '18',
    is_tax_inclusive: true,
    category_id: '',
    initial_quantity: '0',
    low_stock_threshold: '10'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert strings to appropriate types
    const payload = {
      ...formData,
      base_price: parseFloat(formData.base_price),
      tax_rate: parseFloat(formData.tax_rate),
      initial_quantity: parseInt(formData.initial_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      category_id: formData.category_id ? Number(formData.category_id) : null
    };

    createMutation.mutate(payload, {
      onSuccess: () => navigate('/dashboard/products'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/dashboard/products')} className="mb-2 text-slate-500">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input 
                    required
                    placeholder="e.g. Wireless Mouse"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU (Internal Code)</label>
                    <Input 
                      placeholder="SKU-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HSN Code</label>
                    <Input 
                      placeholder="8471"
                      value={formData.hsn_code}
                      onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Pricing & Tax</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selling Price (Base) *</label>
                    <Input 
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GST Rate (%) *</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                    >
                      <option value="0">0% (Nil)</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox"
                    id="is_tax_inclusive"
                    className="w-4 h-4 text-indigo-600 rounded"
                    checked={formData.is_tax_inclusive}
                    onChange={(e) => setFormData({ ...formData, is_tax_inclusive: e.target.checked })}
                  />
                  <label htmlFor="is_tax_inclusive" className="text-sm text-slate-600">Price is Inclusive of GST</label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Sidebar info */}
          <div className="space-y-6">
            <Card className="border-slate-200 bg-slate-50/30">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Inventory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Opening Stock</label>
                  <Input 
                    type="number"
                    value={formData.initial_quantity}
                    onChange={(e) => setFormData({ ...formData, initial_quantity: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400">Current available quantity in store.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Low Stock Alert at</label>
                  <Input 
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400">Notify when stock falls below this level.</p>
                </div>
              </CardContent>
            </Card>

            <Button 
               type="submit" 
               className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold text-base gap-2"
               disabled={createMutation.isPending}
            >
               <Save className="w-5 h-5" />
               {createMutation.isPending ? 'Saving Product...' : 'Save Product'}
            </Button>
            {createMutation.isError && (
              <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">{createMutation.error.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
