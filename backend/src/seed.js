/**
 * Database Seeder
 * Creates default roles, subscriptions, and a Super Admin user
 * Run: node src/seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');

// Import models to register them
require('./models');

const { Role, Subscription, User, Tenant } = require('./models');

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Sync all models (creates tables if not exist)
    await sequelize.sync({ alter: true });
    console.log('✔ Database synced');

    // 1. Seed Roles
    const roles = ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'CASHIER'];
    for (const name of roles) {
      await Role.findOrCreate({ where: { name } });
    }
    console.log('✔ Roles seeded:', roles.join(', '));

    // 2. Seed Subscription Plans
    const plans = [
      { name: 'Trial',      price: 0,    duration_days: 30  },
      { name: 'Core POS',   price: 999,  duration_days: 365 },
      { name: 'Pro SaaS',   price: 2499, duration_days: 365 },
      { name: 'Enterprise', price: 4999, duration_days: 365 },
    ];
    for (const plan of plans) {
      await Subscription.findOrCreate({ where: { name: plan.name }, defaults: plan });
    }
    console.log('✔ Subscription plans seeded');

    // 3. Seed Super Admin user (no tenant)
    const superAdminRole = await Role.findOne({ where: { name: 'SUPER_ADMIN' } });
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const [superAdmin, created] = await User.findOrCreate({
      where: { email: 'admin@saaspos.com' },
      defaults: {
        name: 'Super Admin',
        email: 'admin@saaspos.com',
        password_hash: passwordHash,
        role_id: superAdminRole.id,
        tenant_id: null,
        is_active: true,
      }
    });

    if (created) {
      console.log('✔ Super Admin created');
    } else {
      console.log('ℹ Super Admin already exists — skipped');
    }

    // 4. Seed a Demo Tenant + Owner for testing
    const trialPlan = await Subscription.findOne({ where: { name: 'Trial' } });
    const ownerRole = await Role.findOne({ where: { name: 'OWNER' } });

    const [demoTenant] = await Tenant.findOrCreate({
      where: { name: 'Demo Store' },
      defaults: {
        name: 'Demo Store',
        gstin: '27AABCU9603R1ZX',
        address: '123 MG Road, Mumbai, Maharashtra',
        state: 'Maharashtra',
        subscription_id: trialPlan.id,
        is_active: true,
      }
    });

    const ownerPasswordHash = await bcrypt.hash('Owner@123', 10);
    await User.findOrCreate({
      where: { email: 'owner@demo.com' },
      defaults: {
        name: 'Demo Owner',
        email: 'owner@demo.com',
        password_hash: ownerPasswordHash,
        role_id: ownerRole.id,
        tenant_id: demoTenant.id,
        is_active: true,
      }
    });
    console.log('✔ Demo Tenant + Owner seeded');

    console.log('\n========================================');
    console.log('✅ Seed complete! Login credentials:');
    console.log('----------------------------------------');
    console.log('👑 Super Admin:');
    console.log('   Email   : admin@saaspos.com');
    console.log('   Password: Admin@123');
    console.log('   Access  : /super-admin');
    console.log('----------------------------------------');
    console.log('🏪 Demo Owner:');
    console.log('   Email   : owner@demo.com');
    console.log('   Password: Owner@123');
    console.log('   Access  : /dashboard');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seed();
