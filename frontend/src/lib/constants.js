/**
 * Application Constants
 */

export const ROLES = {
  SUPER_ADMIN: { id: 1, name: 'SUPER_ADMIN' },
  OWNER:       { id: 2, name: 'OWNER' },
  MANAGER:     { id: 3, name: 'MANAGER' },
  CASHIER:     { id: 4, name: 'CASHIER' },
};

export const STAFF_ROLES = [
  ROLES.MANAGER,
  ROLES.CASHIER,
];

