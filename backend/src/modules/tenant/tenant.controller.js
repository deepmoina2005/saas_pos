const tenantService = require('./tenant.service');
const logger = require('../../config/logger');

// POST /tenants is handled by Auth -> Register (as requesting a new SaaS tenant)

const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.getTenants();
    res.status(200).json(tenants);
  } catch (error) {
    logger.error('Error fetching tenants:', error);
    next(error);
  }
};

const getTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Authorization check: If OWNER/STAFF, they can only view their own tenant profile
    if (req.user.role !== 'SUPER_ADMIN' && parseInt(id) !== req.tenantId) {
       return res.status(403).json({ message: 'Access denied to this tenant profile' });
    }

    const tenant = await tenantService.getTenantById(id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    res.status(200).json(tenant);
  } catch (error) {
    next(error);
  }
};

const updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;

     // Authorization check
     if (req.user.role !== 'SUPER_ADMIN' && parseInt(id) !== req.tenantId) {
        return res.status(403).json({ message: 'Access denied to edit this tenant profile' });
     }

     const updated = await tenantService.updateTenant(id, req.body);
     res.status(200).json(updated);
  } catch (error) {
     next(error);
  }
};

module.exports = {
  getAllTenants,
  getTenant,
  updateTenant
};
