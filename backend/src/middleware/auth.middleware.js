const { verifyToken } = require('../utils/jwt.util');
const { User, Role } = require('../models');

// Authenticate Middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Token expired or invalid' });
    }

    // Attach user payload to request
    req.user = decoded; 
    
    // Inject tenantId for downstream multi-tenant isolation
    req.tenantId = decoded.tenant_id;

    next();
  } catch (error) {
    next(error);
  }
};

// Role-Based Access Control Middleware
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. User not authenticated.' });
    }

    // JWT may store role as a string or as an object { name }
    const roleName = typeof req.user.role === 'object' ? req.user.role?.name : req.user.role;

    if (!roleName || !allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
