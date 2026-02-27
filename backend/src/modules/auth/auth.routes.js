const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Public Routes
router.post('/register', authController.registerTenantOwner);
router.post('/login', authController.login);

module.exports = router;
