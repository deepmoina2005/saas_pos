const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date(), env: env.NODE_ENV });
});

// API Routes
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/tenants', require('./modules/tenant/tenant.routes'));
app.use('/api/v1/users', require('./modules/user/user.routes'));
app.use('/api/v1/inventory', require('./modules/inventory/inventory.routes'));
app.use('/api/v1/sales', require('./modules/sales/sales.routes'));
app.use('/api/v1/reports', require('./modules/reports/reports.routes'));

// 404 handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
