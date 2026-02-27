const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      tenant_id: user.tenant_id, 
      role: user.role.name 
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
};

// Verify Token
const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
