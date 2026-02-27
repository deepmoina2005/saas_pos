import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportAPI } from './reportAPI';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Input } from "@/components/ui/input";

export default function TaxReportPage() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: taxData, isLoading } = useQuery({
    queryKey: ['taxSummary', dateRange],
    queryFn: () => reportAPI.getTaxSummary(dateRange.startDate, dateRange.endDate),
  });

  const totals = {
    cgst: Number(taxData?.totalCgst || 0),
    sgst: Number(taxData?.totalSgst || 0),
    igst: Number(taxData?.totalIgst || 0),
    total: Number(taxData?.totalCgst || 0) + Number(taxData?.totalSgst || 0) + Number(taxData?.totalIgst || 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Tax Reports (GST)</h1>
          <p className="text-slate-500 mt-1">Summary of CGST, SGST, and IGST collections for the selected period.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export Report
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="bg-slate-900 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
               <CardDescription className="text-slate-400 font-bold uppercase text-[10px]">Total GST Collected</CardDescription>
               <CardTitle className="text-3xl font-black">₹{totals.total.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
         </Card>
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
               <CardDescription className="text-slate-500 font-bold uppercase text-[10px]">CGST (Central)</CardDescription>
               <CardTitle className="text-xl font-bold text-slate-900">₹{totals.cgst.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
         </Card>
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
               <CardDescription className="text-slate-500 font-bold uppercase text-[10px]">SGST (State)</CardDescription>
               <CardTitle className="text-xl font-bold text-slate-900">₹{totals.sgst.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
         </Card>
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
               <CardDescription className="text-slate-500 font-bold uppercase text-[10px]">IGST (Interstate)</CardDescription>
               <CardTitle className="text-xl font-bold text-slate-900">₹{totals.igst.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
         </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
         <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex justify-between items-center">
               <CardTitle className="text-lg">Tax Breakdown by Rate</CardTitle>
               <div className="flex gap-2">
                  <Input 
                    type="date" 
                    className="w-40" 
                    value={dateRange.startDate} 
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  />
                  <Input 
                    type="date" 
                    className="w-40" 
                    value={dateRange.endDate} 
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  />
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Taxable Amount</TableHead>
                     <TableHead>Tax Rate</TableHead>
                     <TableHead>CGST</TableHead>
                     <TableHead>SGST</TableHead>
                     <TableHead>IGST</TableHead>
                     <TableHead className="text-right">Total Tax</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-10">Loading tax records...</TableCell></TableRow>
                  ) : taxData?.breakdown?.map((item, i) => (
                    <TableRow key={i}>
                       <TableCell className="font-medium">₹{Number(item.taxableAmount).toLocaleString('en-IN')}</TableCell>
                       <TableCell><Badge variant="outline">{item.rate}%</Badge></TableCell>
                       <TableCell>₹{Number(item.cgst).toFixed(2)}</TableCell>
                       <TableCell>₹{Number(item.sgst).toFixed(2)}</TableCell>
                       <TableCell>₹{Number(item.igst).toFixed(2)}</TableCell>
                       <TableCell className="text-right font-bold">₹{Number(item.totalTax).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {!taxData?.breakdown?.length && !isLoading && (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400 italic">No tax data found for this period.</TableCell></TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4 items-start">
         <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
         <div>
            <h3 className="font-bold text-indigo-900">GST Filing Ready</h3>
            <p className="text-sm text-indigo-700 mt-1">This report is generated based on your real-time sales data. You can download the CSV format to import into your GST filing software or share it with your accountant.</p>
         </div>
      </div>
    </div>
  );
}
