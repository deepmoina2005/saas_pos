const userService = require('./user.service');
const logger = require('../../config/logger');

const getTenantUsers = async (req, res, next) => {
  try {
    const users = await userService.getTenantUsers(req.tenantId);
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.tenantId, req.body);
    
    // Don't leak hashed password
    const { password_hash, ...userSafeData } = newUser.toJSON();
    
    res.status(201).json({
      message: 'User created successfully',
      user: userSafeData
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate that the request body is not empty
    if(Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' })
    }

    const updated = await userService.updateUser(id, req.tenantId, req.body);
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTenantUsers,
  createUser,
  updateUser
};
