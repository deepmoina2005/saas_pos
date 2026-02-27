import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportAPI } from './reportAPI';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Boxes, TrendingDown, IndianRupee } from 'lucide-react';

export default function InventoryReport() {
  const { data: valuation, isLoading } = useQuery({
    queryKey: ['inventoryValuation'],
    queryFn: () => reportAPI.getInventoryValuation(),
  });

  const { data: topProducts } = useQuery({
    queryKey: ['topProducts'],
    queryFn: () => reportAPI.getTopProducts(),
  });

  if (isLoading) return <div className="p-8 italic text-slate-500">Calculating inventory valuation...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Inventory Analytics</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of stock value and asset performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-indigo-600 text-white border-none shadow-md">
            <CardHeader className="pb-2">
               <CardDescription className="text-indigo-100 font-bold uppercase text-[10px]">Total Inventory Value</CardDescription>
               <CardTitle className="text-3xl font-black flex items-center gap-2">
                  <IndianRupee className="w-6 h-6" />
                  {Number(valuation?.totalValue || 0).toLocaleString('en-IN')}
               </CardTitle>
            </CardHeader>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="border-slate-200">
            <CardHeader>
               <CardTitle className="text-lg">Stock Performance Assets</CardTitle>
               <CardDescription>Top products contributing to inventory value.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Valuation</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {valuation?.breakdown?.slice(0, 10).map((item, i) => (
                        <TableRow key={i}>
                           <TableCell className="font-medium text-slate-700">{item.name}</TableCell>
                           <TableCell>{item.quantity} Units</TableCell>
                           <TableCell className="text-right font-bold">₹{Number(item.value).toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         <Card className="border-slate-200">
            <CardHeader>
               <CardTitle className="text-lg">Top Moving Products</CardTitle>
               <CardDescription>Items with highest sales frequency today.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {topProducts?.map((item, i) => (
                        <TableRow key={i}>
                           <TableCell className="font-medium text-slate-700">{item.product?.name}</TableCell>
                           <TableCell>
                              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                                 {item.totalSold} Qty
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right font-bold">₹{Number(item.totalRevenue).toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
