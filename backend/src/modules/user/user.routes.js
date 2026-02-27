const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// List staff
router.get('/', authorize(['OWNER', 'MANAGER']), userController.getTenantUsers);

// Add staff
router.post('/', authorize(['OWNER', 'MANAGER']), userController.createUser);

// Update staff (e.g., deactivate, change role)
router.patch('/:id', authorize(['OWNER', 'MANAGER']), userController.updateUser);

module.exports = router;
