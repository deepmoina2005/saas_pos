import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoicePrintView() {
  const { id } = useParams();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data } = await api.get(`/sales/invoice/${id}`);
      return data;
    },
    enabled: !!id
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="p-10">Loading invoice data...</div>;
  if (!invoice) return <div className="p-10 text-rose-500">Invoice not found or access denied.</div>;

  const sale = invoice.sale;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
         <Button variant="outline" asChild>
             <Link to="/dashboard/sales"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Sales</Link>
         </Button>
         <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700">
             <Printer className="w-4 h-4 mr-2" /> Print A4 Invoice
         </Button>
      </div>

      {/* A4 Printable Area */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg print:shadow-none p-10 border border-slate-200">
         {/* Header */}
         <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Tax Invoice</h1>
               <p className="text-slate-500 font-medium mt-1">Invoice #{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
               <h2 className="text-xl font-bold text-slate-800">{invoice.Tenant?.name || 'Your Business Name'}</h2>
               <p className="text-sm text-slate-600 mt-1">{invoice.Tenant?.address || '123 Business Street, City, State'}</p>
               <p className="text-sm font-semibold text-slate-700 mt-1 break-all">GSTIN: {invoice.Tenant?.gstin || '29ABCDE1234F2Z5'}</p>
            </div>
         </div>

         {/* Meta Information */}
         <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
               <p className="text-slate-800 font-medium">Walk-in Customer</p>
               {/* In a fuller app, customer lookup details go here */}
            </div>
            <div className="text-right">
               <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="text-slate-800">{format(new Date(sale.created_at), 'dd MMM yyyy, hh:mm a')}</span>
                  <span className="font-semibold text-slate-500">Cashier:</span>
                  <span className="text-slate-800">{sale.cashier?.name}</span>
                  <span className="font-semibold text-slate-500">Payment:</span>
                  <span className="text-slate-800 uppercase font-bold">{sale.payment_mode}</span>
               </div>
            </div>
         </div>

         {/* Items Table */}
         <table className="w-full text-left border-collapse mb-8">
            <thead>
               <tr className="border-b-2 border-slate-200">
                  <th className="py-3 font-bold text-slate-700 w-1/2">Item Description</th>
                  <th className="py-3 font-bold text-slate-700 text-center">Qty</th>
                  <th className="py-3 font-bold text-slate-700 text-right">Unit Price</th>
                  <th className="py-3 font-bold text-slate-700 text-right">Tax</th>
                  <th className="py-3 font-bold text-slate-700 text-right">Total</th>
               </tr>
            </thead>
            <tbody className="text-slate-600 text-sm align-top border-b-2 border-slate-200">
               {sale.items?.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                     <td className="py-4 font-medium text-slate-800">
                        {item.product?.name}
                        {item.product?.hsn_code && <div className="text-xs text-slate-400 mt-0.5">HSN: {item.product.hsn_code}</div>}
                     </td>
                     <td className="py-4 text-center">{item.quantity}</td>
                     <td className="py-4 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                     <td className="py-4 text-right">₹{Number(item.tax_amount).toFixed(2)}</td>
                     <td className="py-4 text-right font-bold text-slate-800">₹{Number(item.subtotal).toFixed(2)}</td>
                  </tr>
               ))}
            </tbody>
         </table>

         {/* Totals & Tax Summary */}
         <div className="flex justify-between items-start">
            <div className="w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">GST Tax Summary</h4>
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-600">CGST</span>
                     <span className="font-medium text-slate-800">₹{Number(sale.cgst_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-600">SGST</span>
                     <span className="font-medium text-slate-800">₹{Number(sale.sgst_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-600">IGST</span>
                     <span className="font-medium text-slate-800">₹{Number(sale.igst_total).toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="w-2/5 my-auto pl-8 border-l border-slate-200 space-y-3">
               <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{(Number(sale.total_amount) - Number(sale.cgst_total) - Number(sale.sgst_total) - Number(sale.igst_total)).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-slate-600">
                  <span>Total Tax</span>
                  <span className="font-medium">₹{(Number(sale.cgst_total) + Number(sale.sgst_total) + Number(sale.igst_total)).toFixed(2)}</span>
               </div>
               {Number(sale.discount) > 0 && (
                 <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{Number(sale.discount).toFixed(2)}</span>
                 </div>
               )}
               <div className="flex justify-between items-center text-xl pt-3 border-t-2 border-slate-900">
                  <span className="font-black text-slate-900">Grand Total</span>
                  <span className="font-black text-indigo-700">₹{Number(sale.total_amount).toFixed(2)}</span>
               </div>
            </div>
         </div>
         
         {/* Footer */}
         <div className="mt-16 text-center text-xs text-slate-400 pt-6 border-t border-slate-100">
             Thank you for your business. For any queries, please retain this invoice.
         </div>
      </div>
    </div>
  );
}
