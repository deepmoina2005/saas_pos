import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesAPI } from './salesAPI';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Eye, Calendar, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function SalesHistoryPage() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['salesHistory'],
    queryFn: () => salesAPI.getHistory(),
  });

  if (isLoading) return <div className="p-8">Loading transaction history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Sales & Invoices</h1>
          <p className="text-slate-500 mt-1">Review your past transactions and print duplicate receipts.</p>
        </div>
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-2 border-r pr-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">All Time</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-bold">Total Volume:</span>
              <span className="text-sm font-bold text-slate-900">{sales?.length || 0} Sales</span>
           </div>
        </div>
      </div>

      <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer / Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax (GST)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-slate-50/30">
                <TableCell className="font-bold text-indigo-600">
                  {sale.invoice?.invoice_number || `INV-${sale.id}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-700">{format(new Date(sale.createdAt), 'dd MMM yyyy')}</span>
                    <span className="text-[10px] text-slate-400">{format(new Date(sale.createdAt), 'hh:mm a')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">{sale.payment_mode}</Badge>
                    <span className="text-sm text-slate-600">{sale.user?.name} (Cashier)</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ₹{Number(sale.total_amount).toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                   <span className="text-xs text-emerald-600 font-medium">₹{(Number(sale.cgst_total) + Number(sale.sgst_total) + Number(sale.igst_total)).toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                   <Button variant="ghost" size="sm" asChild className="text-slate-500">
                      <Link to={`/invoice/${sale.id}`}>
                         <Printer className="w-4 h-4 mr-2" /> Print
                      </Link>
                   </Button>
                </TableCell>
              </TableRow>
            ))}
            {sales?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                   No sales history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
