const { Sale, SaleItem, Product, Inventory, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getDailySales = async (tenantId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const sales = await Sale.findAll({
    where: {
      tenant_id: tenantId,
      created_at: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
      [sequelize.fn('SUM', sequelize.col('discount')), 'totalDiscounts']
    ]
  });

  return sales[0];
};

const getTaxSummary = async (tenantId, startDate, endDate) => {
  const sales = await Sale.findAll({
    where: {
      tenant_id: tenantId,
      created_at: {
         [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('cgst_total')), 'totalCgst'],
      [sequelize.fn('SUM', sequelize.col('sgst_total')), 'totalSgst'],
      [sequelize.fn('SUM', sequelize.col('igst_total')), 'totalIgst']
    ]
  });

  return sales[0];
};

const getInventoryValuation = async (tenantId) => {
  const inventory = await Inventory.findAll({
    where: { tenant_id: tenantId },
    include: [{ model: Product, as: 'product', attributes: ['base_price'] }]
  });

  let totalValue = 0;
  inventory.forEach(item => {
    totalValue += (Number(item.quantity) * Number(item.product.base_price));
  });

  return { totalValue: Number(totalValue.toFixed(2)) };
};

const getTopProducts = async (tenantId, limit = 5) => {
   return await SaleItem.findAll({
       include: [
           { 
               model: Sale, 
               as: 'sale', 
               where: { tenant_id: tenantId },
               attributes: [] 
           },
           { model: Product, as: 'product', attributes: ['name', 'sku'] }
       ],
       attributes: [
           'product_id',
           [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
           [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue']
       ],
       group: ['product_id', 'product.id'],
       order: [[sequelize.literal('totalSold'), 'DESC']],
       limit
   });
};

module.exports = {
  getDailySales,
  getTaxSummary,
  getInventoryValuation,
  getTopProducts
};
