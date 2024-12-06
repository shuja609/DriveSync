import api from './axiosConfig';

const orderService = {
    // Get all orders (admin only)
    getAllOrders: async () => {
        try {
            const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
            console.log('User data:', userData);
            if (userData) {
                const { token } = JSON.parse(userData);
                console.log('Auth token:', token);
            }
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get user's orders
    getMyOrders: async () => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    // Get single order
    getOrder: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Create new order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Update order status (admin only)
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    }
};

export default orderService; 