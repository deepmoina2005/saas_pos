const express = require('express');
const router = express.Router();
const tenantController = require('./tenant.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);

// SUPER_ADMIN only Route
router.get('/', authorize(['SUPER_ADMIN']), tenantController.getAllTenants);

// Authenticated route, checked via logic internally for OWNER vs SUPER_ADMIN
router.get('/:id', tenantController.getTenant);
router.patch('/:id', authorize(['SUPER_ADMIN', 'OWNER']), tenantController.updateTenant);

module.exports = router;
