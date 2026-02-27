import { useDispatch, useSelector } from "react-redux";

import {
  selectCartItems,
  selectCartTotals,
  selectCartPaymentMode,
  selectIsIntraState,
  removeItem,
  updateQuantity,
  clearCart,
  setPaymentMode,
  toggleIntraState
} from '@/features/pos/cartSlice';

import { useCheckout } from '@/features/pos/posHooks';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  ShoppingCart,
  Info
} from 'lucide-react';

import { cn } from '@/lib/utils';

export default function POSCartPane() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { subtotal, taxTotal, cgst, sgst, igst, finalTotal } = useSelector(selectCartTotals);
  const paymentMode = useSelector(selectCartPaymentMode);
  const isIntraState = useSelector(selectIsIntraState);
  const checkoutMutation = useCheckout();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    checkoutMutation.mutate({
      items: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      paymentMode,
      discount: 0,
      isIntraState
    }, {
       onSuccess: () => {
           dispatch(clearCart());
       }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-l w-[400px] shadow-xl relative z-10 flex-shrink-0">
      <div className="p-5 border-b bg-indigo-50/50 flex justify-between items-center">
         <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 font-outfit">Current Order</h2>
            <p className="text-sm text-slate-500 font-medium">{cartItems.length} items added</p>
         </div>
         <Button variant="ghost" size="sm" onClick={() => dispatch(clearCart())} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
            Clear All
         </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {cartItems.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[300px] text-slate-300 gap-3">
               <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
                   <ShoppingCart className="w-8 h-8" />
               </div>
               <p className="text-sm font-medium">Scan barcode or select items</p>
           </div>
        ) : (
           <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex flex-col p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-slate-800 line-clamp-2 leading-tight pr-2 text-sm">{item.product.name}</span>
                       <button onClick={() => dispatch(removeItem(item.product.id))} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                       </button>
                   </div>
                   <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1 bg-slate-50 border rounded-lg p-0.5">
                         <button 
                            className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-md transition-all"
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: Math.max(1, item.quantity - 1) }))}
                         ><Minus className="w-3.5 h-3.5" /></button>
                         <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                         <button 
                            className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-md transition-all"
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                         ><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₹{(Number(item.product.base_price) * item.quantity).toLocaleString('en-IN')}</span>
                   </div>
                </div>
              ))}
           </div>
        )}
      </ScrollArea>

      <div className="border-t p-5 bg-slate-50/80 backdrop-blur-sm space-y-4">
         <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Sale Details</span>
                <button onClick={() => dispatch(toggleIntraState())} className={cn(
                   "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
                   isIntraState ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-amber-50 text-amber-600 border-amber-200"
                )}>
                   {isIntraState ? 'Intra-state (Local)' : 'Inter-state'}
                </button>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-700">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {isIntraState ? (
               <>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-400">CGST (Central)</span>
                     <span className="text-slate-600">₹{cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-400">SGST (State)</span>
                     <span className="text-slate-600">₹{sgst.toLocaleString('en-IN')}</span>
                  </div>
               </>
            ) : (
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">IGST (Interstate)</span>
                  <span className="text-slate-600">₹{igst.toLocaleString('en-IN')}</span>
               </div>
            )}
            <Separator className="my-1 opacity-50" />
            <div className="flex justify-between items-center pt-1">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-xl font-black text-indigo-600">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
         </div>
         
         <div className="grid grid-cols-3 gap-2">
             <Button 
               variant="outline" 
               onClick={() => dispatch(setPaymentMode('CASH'))}
               className={cn(
                "flex flex-col items-center gap-1 h-14 bg-white border-slate-200 transition-all",
                paymentMode === 'CASH' && "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
               )}
             >
                 <Banknote className={cn("w-4 h-4", paymentMode === 'CASH' ? "text-indigo-600" : "text-slate-400")} />
                 <span className="text-[10px] font-bold uppercase tracking-tight">Cash</span>
             </Button>
             <Button 
               variant="outline" 
               onClick={() => dispatch(setPaymentMode('CARD'))}
               className={cn(
                "flex flex-col items-center gap-1 h-14 bg-white border-slate-200 transition-all",
                paymentMode === 'CARD' && "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
               )}
             >
                 <CreditCard className={cn("w-4 h-4", paymentMode === 'CARD' ? "text-indigo-600" : "text-slate-400")} />
                 <span className="text-[10px] font-bold uppercase tracking-tight">Card</span>
             </Button>
             <Button 
               variant="outline" 
               onClick={() => dispatch(setPaymentMode('UPI'))}
               className={cn(
                "flex flex-col items-center gap-1 h-14 bg-white border-slate-200 transition-all",
                paymentMode === 'UPI' && "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
               )}
             >
                 <SmartphoneNfc className={cn("w-4 h-4", paymentMode === 'UPI' ? "text-indigo-600" : "text-slate-400")} />
                 <span className="text-[10px] font-bold uppercase tracking-tight">UPI / QR</span>
             </Button>
         </div>

         <Button 
            className="w-full h-14 text-lg font-black shadow-xl shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-xl"
            disabled={cartItems.length === 0 || checkoutMutation.isPending}
            onClick={handleCheckout}
         >
            {checkoutMutation.isPending ? 'Processing...' : 'Complete Payment'}
         </Button>
      </div>
    </div>
  );
}
