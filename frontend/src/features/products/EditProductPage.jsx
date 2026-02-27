import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts, useUpdateProduct, useCategories } from './productHooks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    hsn_code: '',
    base_price: '',
    tax_rate: '18',
    is_tax_inclusive: true,
    category_id: '',
    low_stock_threshold: '10'
  });

  useEffect(() => {
    if (products && id) {
      const product = products.find(p => p.id === Number(id));
      if (product) {
        setFormData({
          name: product.name,
          sku: product.sku || '',
          barcode: product.barcode || '',
          hsn_code: product.hsn_code || '',
          base_price: product.base_price,
          tax_rate: product.tax_rate,
          is_tax_inclusive: product.is_tax_inclusive,
          category_id: product.category_id || '',
          low_stock_threshold: product.low_stock_threshold
        });
      }
    }
  }, [products, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      base_price: parseFloat(formData.base_price),
      tax_rate: parseFloat(formData.tax_rate),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      category_id: formData.category_id ? Number(formData.category_id) : null
    };

    updateMutation.mutate({ id: Number(id), data: payload }, {
      onSuccess: () => navigate('/dashboard/products'),
    });
  };

  if (isLoading) return <div className="p-8">Loading product details...</div>;

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
                <CardTitle>Edit Product: {formData.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU (Internal Code)</label>
                    <Input 
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HSN Code</label>
                    <Input 
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
                    id="is_tax_inclusive_edit"
                    className="w-4 h-4 text-indigo-600 rounded"
                    checked={formData.is_tax_inclusive}
                    onChange={(e) => setFormData({ ...formData, is_tax_inclusive: e.target.checked })}
                  />
                  <label htmlFor="is_tax_inclusive_edit" className="text-sm text-slate-600">Price is Inclusive of GST</label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-slate-50/30">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Alert Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Low Stock Alert at</label>
                  <Input 
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
               type="submit" 
               className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold text-base gap-2"
               disabled={updateMutation.isPending}
            >
               <Save className="w-5 h-5" />
               {updateMutation.isPending ? 'Updating...' : 'Update Product'}
            </Button>
            {updateMutation.isError && (
              <p className="text-sm text-rose-500 p-3 bg-rose-50 rounded-lg">{updateMutation.error.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
