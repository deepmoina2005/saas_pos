const { Sale, SaleItem, Product, Inventory, Invoice, sequelize } = require('../../models');
const { calculateGST, calculateExclusiveFromInclusive } = require('../../utils/gstCalculator');

const processCheckout = async (tenantId, userId, cartData) => {
  const { items, paymentMode, discount = 0, isIntraState = true } = cartData;
  const t = await sequelize.transaction();

  try {
    let finalTotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    // 1. Create Sale Record (amounts will be updated after processing items)
    const sale = await Sale.create({
      tenant_id: tenantId,
      user_id: userId,
      total_amount: 0,
      discount: discount,
      payment_mode: paymentMode || 'CASH'
    }, { transaction: t });

    // 2. Process Cart Items
    for (const item of items) {
      // Find product and inventory
      const product = await Product.findOne({ where: { id: item.productId, tenant_id: tenantId }, transaction: t });
      if (!product) throw new Error(`Product ID ${item.productId} not found`);

      const inventory = await Inventory.findOne({ where: { product_id: product.id, tenant_id: tenantId }, transaction: t });
      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // 3. GST Calculations
      let basePrice = Number(product.base_price);
      if (product.is_tax_inclusive) {
        basePrice = calculateExclusiveFromInclusive(product.base_price, product.tax_rate);
      }

      const gstSplit = calculateGST(basePrice, product.tax_rate, isIntraState, item.quantity);
      
      // Accumulate totals
      totalCgst += gstSplit.cgst;
      totalSgst += gstSplit.sgst;
      totalIgst += gstSplit.igst;
      finalTotal += gstSplit.subtotal;

      // 4. Create Sale Item
      await SaleItem.create({
        sale_id: sale.id,
        product_id: product.id,
        quantity: item.quantity,
        unit_price: basePrice,
        tax_amount: gstSplit.taxAmount,
        subtotal: gstSplit.subtotal
      }, { transaction: t });

      // 5. Deduct Inventory (Atomic update)
      inventory.quantity -= item.quantity;
      await inventory.save({ transaction: t });
    }

    // Apply global discount if any
    finalTotal -= discount;

    // 6. Update Sale Totals
    sale.total_amount = finalTotal;
    sale.cgst_total = totalCgst;
    sale.sgst_total = totalSgst;
    sale.igst_total = totalIgst;
    await sale.save({ transaction: t });

    // 7. Generate Sequential Invoice Number (e.g. INV-XXXX)
    // Basic logic for simplicity; could use a sequence table
    const invoiceCount = await Invoice.count({ where: { tenant_id: tenantId }, transaction: t });
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`;

    const invoice = await Invoice.create({
      tenant_id: tenantId,
      sale_id: sale.id,
      invoice_number: invoiceNumber
    }, { transaction: t });

    await t.commit();
    return { sale, invoiceNumber: invoice.invoice_number };

  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getSalesHistory = async (tenantId) => {
  return await Sale.findAll({
    where: { tenant_id: tenantId },
    order: [['created_at', 'DESC']],
    include: [{ model: SaleItem, as: 'items', include: ['product'] }]
  });
};

const getInvoiceDetails = async (tenantId, invoiceId) => {
    return await Invoice.findOne({
      where: { id: invoiceId, tenant_id: tenantId },
      include: [
        { 
          model: Sale, 
          as: 'sale',
          include: ['items', 'cashier'] 
        }
      ]
    });
};

module.exports = {
  processCheckout,
  getSalesHistory,
  getInvoiceDetails
};
