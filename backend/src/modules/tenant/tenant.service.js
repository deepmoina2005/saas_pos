const { Tenant, Subscription } = require('../../models');

const getTenants = async () => {
  return await Tenant.findAll({
    include: [{ model: Subscription, as: 'subscription', attributes: ['name', 'price'] }]
  });
};

const getTenantById = async (id) => {
  return await Tenant.findByPk(id, {
    include: [{ model: Subscription, as: 'subscription' }]
  });
};

const updateTenant = async (id, data) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw new Error('Tenant not found');
  
  return await tenant.update(data);
};

module.exports = {
  getTenants,
  getTenantById,
  updateTenant
};
