import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../products/productHooks';
import { inventoryAPI } from '../inventory/inventoryAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

export default function InventoryAdjustmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useProducts();
  const [adjustment, setAdjustment] = useState('');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products && id) {
      setProduct(products.find(p => p.id === Number(id)));
    }
  }, [products, id]);

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, delta }) => inventoryAPI.updateStock(productId, delta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/dashboard/products');
    }
  });

  const handleAdjust = (type) => {
    const delta = parseInt(adjustment);
    if (isNaN(delta) || delta <= 0) return;
    
    updateStockMutation.mutate({ 
      productId: Number(id), 
      delta: type === 'ADD' ? delta : -delta 
    });
  };

  if (isLoading || !product) return <div className="p-8">Searching for product inventory...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/dashboard/products')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Button>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
           <div className="flex justify-between items-start">
             <div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>Stock Adjustment for SKU: {product.sku}</CardDescription>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">On Hand</p>
                <p className="text-3xl font-black text-slate-900">{product.inventory?.quantity || 0}</p>
             </div>
           </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Quantity to Adjust</label>
              <Input 
                 type="number"
                 placeholder="Enter quantity"
                 className="text-lg h-12"
                 value={adjustment}
                 onChange={(e) => setAdjustment(e.target.value)}
              />
              <p className="text-xs text-slate-400">Enter the absolute quantity you want to add or subtract from current stock.</p>
           </div>

           <div className="flex gap-4">
              <Button 
                onClick={() => handleAdjust('ADD')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold"
                disabled={updateStockMutation.isPending}
              >
                 {updateStockMutation.isPending ? <RefreshCw className="animate-spin mr-2" /> : '+ Add to Stock'}
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleAdjust('REMOVE')}
                className="flex-1 h-12 text-lg font-bold"
                disabled={updateStockMutation.isPending}
              >
                 {updateStockMutation.isPending ? <RefreshCw className="animate-spin mr-2" /> : '- Remove from Stock'}
              </Button>
           </div>

           {product.inventory?.quantity < product.low_stock_threshold && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 items-center text-amber-800">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p className="text-sm">This product is currently in <b>Low Stock</b>. Consider ordering more from your supplier.</p>
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
