import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/features/pos/cartSlice';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Barcode } from 'lucide-react';

export default function POSProductGrid({ products, isLoading }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products?.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm))
  );

  const handleProductClick = (product) => {
      // In a real app we'd verify stock first
      if (product.inventory_details?.quantity > 0) {
        dispatch(addItem({ product, quantity: 1 }));
      } else {
        alert("Out of stock!");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <div className="p-4 bg-white border-b shadow-sm space-y-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
                placeholder="Search products by name, SKU, or click to scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-lg py-6"
                autoFocus
             />
             <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 cursor-pointer" />
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium whitespace-nowrap">All Items</button>
              {/* Derived mapped categories would go here */}
           </div>
       </div>

       <ScrollArea className="flex-1 p-4">
          {isLoading ? (
             <div className="flex items-center justify-center py-20 text-slate-500">Loading catalog...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {filteredProducts?.map(product => (
                    <Card 
                       key={product.id} 
                       className={`cursor-pointer transition-all hover:border-indigo-500 hover:shadow-md ${product.inventory_details?.quantity <= 0 ? 'opacity-50 select-none' : ''}`}
                       onClick={() => handleProductClick(product)}
                    >
                        <CardContent className="p-4 flex flex-col h-full justify-between gap-3">
                             <div>
                                 <div className="text-xs font-semibold text-slate-400 mb-1">{product.category?.name || 'Uncategorized'}</div>
                                 <h3 className="font-semibold text-slate-800 line-clamp-2 leading-tight">{product.name}</h3>
                             </div>
                             
                             <div className="flex items-end justify-between mt-2 pt-2 border-t border-slate-100">
                                <span className="text-lg font-bold text-indigo-600">₹{Number(product.base_price).toLocaleString('en-IN')}</span>
                                <span className="text-xs text-slate-500">{product.inventory_details?.quantity} in stock</span>
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          )}
       </ScrollArea>
    </div>
  );
}
