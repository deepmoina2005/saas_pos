/**
 * Admin API Endpoints
 */
import api from '@/lib/axios';

export const getTenants = async () => {
    return api.get('/tenants');
};
