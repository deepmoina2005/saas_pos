import React from 'react';
import { useProducts } from './productHooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, PackageSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) return <div className="p-8 italic text-slate-500">Loading products catalog...</div>;
  if (isError) return <div className="p-8 text-rose-500 bg-rose-50 rounded-lg m-8">Failed to load products. please check your connection.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Products & Catalog</h1>
          <p className="text-slate-500 mt-1">Manage your items, pricing, and GST configurations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/inventory/categories">Manage Categories</Link>
          </Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm border-none">
            <Link to="/dashboard/products/add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Product Info</TableHead>
              <TableHead className="font-semibold text-slate-700">Category</TableHead>
              <TableHead className="font-semibold text-slate-700">Price (Base)</TableHead>
              <TableHead className="font-semibold text-slate-700">Tax Rate</TableHead>
              <TableHead className="font-semibold text-slate-700">Stock Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              const stock = product.inventory?.quantity || 0;
              const threshold = product.low_stock_threshold || 10;
              const isLow = stock <= threshold && stock > 0;
              const isOut = stock === 0;

              return (
                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{product.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{product.sku || 'No SKU'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium">
                      {product.category?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    ₹{Number(product.base_price).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-600">{product.tax_rate}% GST</span>
                    <span className="text-[10px] block text-slate-400">
                      {product.is_tax_inclusive ? '(Incl.)' : '(Excl.)'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isOut ? (
                      <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">Out of Stock</Badge>
                    ) : isLow ? (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Low: {stock}</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{stock} In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild title="Edit details" className="text-slate-400 hover:text-indigo-600">
                      <Link to={`/dashboard/products/edit/${product.id}`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="View Inventory History" className="text-slate-400 hover:text-slate-600">
                       <Link to={`/dashboard/inventory/stock/${product.id}`}>
                          <PackageSearch className="w-4 h-4" />
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                   <div className="flex flex-col items-center gap-2 text-slate-400">
                      <PackageSearch className="w-12 h-12 stroke-[1.5]" />
                      <p className="font-medium text-slate-500">Your product catalog is empty.</p>
                      <Button variant="link" asChild className="text-indigo-600">
                        <Link to="/dashboard/products/add">Start adding products</Link>
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
