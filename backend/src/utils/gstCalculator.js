/**
 * Calculates GST based on intra-state vs inter-state rules.
 * 
 * @param {Number} basePrice - The price of the product without tax
 * @param {Number} taxRate - The percentage of tax (e.g., 18 for 18%)
 * @param {Boolean} isIntraState - True if Seller and Buyer are in same state OR walk-in customer
 * @param {Number} quantity - Quantity of the item
 * @returns {Object} { taxAmount, cgst, sgst, igst, subtotal }
 */
const calculateGST = (basePrice, taxRate, isIntraState = true, quantity = 1) => {
  const priceQty = Number(basePrice) * Number(quantity);
  const taxAmount = priceQty * (Number(taxRate) / 100);
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isIntraState) {
    cgst = taxAmount / 2;
    sgst = taxAmount / 2;
  } else {
    igst = taxAmount;
  }

  return {
    taxAmount: Number(taxAmount.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    igst: Number(igst.toFixed(2)),
    subtotal: Number((priceQty + taxAmount).toFixed(2))
  };
};

/**
 * Reverses GST calculation if price is already inclusive of tax
 */
const calculateExclusiveFromInclusive = (inclusivePrice, taxRate) => {
  const basePrice = inclusivePrice / (1 + (taxRate / 100));
  return Number(basePrice.toFixed(2));
};

module.exports = {
  calculateGST,
  calculateExclusiveFromInclusive
};
