const bcrypt = require('bcryptjs');
const { User, Role } = require('../../models');

const getTenantUsers = async (tenantId) => {
  return await User.findAll({
    where: { tenant_id: tenantId },
    include: [{ model: Role, as: 'role', attributes: ['name'] }]
  });
};

const createUser = async (tenantId, userData) => {
  const { name, email, password, role_id } = userData;

  // Ensure role exists and is not SUPER_ADMIN
  const role = await Role.findByPk(role_id);
  if (!role || role.name === 'SUPER_ADMIN') {
    throw new Error('Invalid role specified');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    tenant_id: tenantId,
    role_id,
    name,
    email,
    password_hash: passwordHash,
    is_active: true
  });

  return newUser;
};

const updateUser = async (userId, tenantId, updateData) => {
  // Scope by tenantId to prevent modifying other tenant's users
  const user = await User.findOne({ where: { id: userId, tenant_id: tenantId } });
  
  if (!user) throw new Error('User not found in this tenant');

  // Handle password update explicitly
  if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password;
  }

  return await user.update(updateData);
};

module.exports = {
  getTenantUsers,
  createUser,
  updateUser
};
