/**
 * POS API Endpoints
 */
import api from '@/lib/axios';

export const checkout = async (data) => {
    return api.post('/sales/checkout', data);
};
