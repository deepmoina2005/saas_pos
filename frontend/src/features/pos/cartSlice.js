import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { product, quantity, unitPrice, taxAmount, subtotal }
  overallDiscount: 0,
  paymentMode: 'CASH',
  isIntraState: true // Used for CGST/SGST vs IGST
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      // In real implementation, GST calculation should run here or wait for backend
      // We store a simplified representation for UX
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          unitPrice: product.base_price,
          taxAmount: 0, // Placeholder
          subtotal: 0   // Placeholder
        });
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    applyDiscount: (state, action) => {
      state.overallDiscount = action.payload;
    },
    setPaymentMode: (state, action) => {
       state.paymentMode = action.payload;
    },
    toggleIntraState: (state) => {
       state.isIntraState = !state.isIntraState;
    },
    clearCart: () => initialState
  }
});

export const { addItem, removeItem, updateQuantity, applyDiscount, setPaymentMode, toggleIntraState, clearCart } = cartSlice.actions;

export const selectCartItems = state => state.cart.items;
export const selectCartPaymentMode = state => state.cart.paymentMode;
export const selectIsIntraState = state => state.cart.isIntraState;

export const selectCartTotals = state => {
  const { items, overallDiscount, isIntraState } = state.cart;
  
  let subtotal = 0;
  let taxTotal = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  items.forEach(item => {
    const { product, quantity } = item;
    let basePrice = Number(product.base_price);
    
    // Reverse calc if inclusive
    if (product.is_tax_inclusive) {
       basePrice = basePrice / (1 + (product.tax_rate / 100));
    }

    const priceQty = basePrice * quantity;
    const taxAmount = priceQty * (product.tax_rate / 100);
    
    subtotal += priceQty;
    taxTotal += taxAmount;

    if (isIntraState) {
       cgst += taxAmount / 2;
       sgst += taxAmount / 2;
    } else {
       igst += taxAmount;
    }
  });

  const finalTotal = subtotal + taxTotal - overallDiscount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxTotal: Number(taxTotal.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    igst: Number(igst.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2))
  };
};

export default cartSlice.reducer;
