const authService = require('./auth.service');
const logger = require('../../config/logger');

const registerTenantOwner = async (req, res, next) => {
  try {
    const { businessName, userName, email, password, gstin, address, state } = req.body;
    
    // Basic validation
    if (!businessName || !userName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await authService.registerTenantOwner({
      businessName, userName, email, password, gstin, address, state
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.loginUser(email, password);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    if (error.message === 'Invalid email or password' || error.message.includes('inactive')) {
        return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  registerTenantOwner,
  login
};
