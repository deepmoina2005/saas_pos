const bcrypt = require('bcryptjs');
const { User, Role, Tenant, Subscription, sequelize } = require('../../models');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt.util');

const registerTenantOwner = async (data) => {
  const t = await sequelize.transaction();

  try {
    // 1. Get trial subscription (or default)
    const subscription = await Subscription.findOne({ where: { name: 'Trial' }, transaction: t });
    
    // 2. Create Tenant
    const tenant = await Tenant.create({
      name: data.businessName,
      gstin: data.gstin || null,
      address: data.address || null,
      state: data.state || null,
      subscription_id: subscription ? subscription.id : null,
      is_active: true
    }, { transaction: t });

    // 3. Get OWNER role
    let ownerRole = await Role.findOne({ where: { name: 'OWNER' }, transaction: t });
    
    // Fallback seed if roles don't exist yet (useful for initial setup)
    if (!ownerRole) {
      ownerRole = await Role.create({ name: 'OWNER' }, { transaction: t });
    }

    // 4. Create Owner User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      tenant_id: tenant.id,
      role_id: ownerRole.id,
      name: data.userName,
      email: data.email,
      password_hash: passwordHash,
      is_active: true
    }, { transaction: t });

    await t.commit();

    // 5. Generate Tokens
    // Need to format user object like when queried with includes
    const userPayload = {
      id: user.id,
      tenant_id: tenant.id,
      role: { name: 'OWNER' }
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return {
      message: 'Tenant and Owner created successfully',
      tenantId: tenant.id,
      accessToken,
      refreshToken
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const loginUser = async (email, password) => {
  // Use scope to include password hash for verification
  const user = await User.scope('withPassword').findOne({
    where: { email, is_active: true },
    include: [{ model: Role, as: 'role' }]
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check valid tenant if user is not super admin
  if (user.tenant_id) {
    const tenant = await Tenant.findOne({ where: { id: user.tenant_id }});
    if (!tenant || !tenant.is_active) {
       throw new Error('Tenant account is inactive or suspended');
    }
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Exclude password from return result
  const { password_hash, ...userWithoutPassword } = user.toJSON();

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
};

module.exports = {
  registerTenantOwner,
  loginUser
};
