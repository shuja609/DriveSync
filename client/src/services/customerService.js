import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getCustomers = async () => {
    try {
        // console.log('Making API call to fetch customers...');
        const response = await axios.get(`${API_URL}/customers`, {
            headers: getAuthHeader()
        });
        // console.log('API response:', response);
        return response.data;
    } catch (error) {
        // console.error('API Error:', error);
        if (error.response) {
            // console.error('Error response:', error.response.data);
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const getCustomer = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const createCustomer = async (customerData) => {
    try {
        const response = await axios.post(`${API_URL}/customers`, customerData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const updateCustomer = async (id, customerData) => {
    try {
        const response = await axios.put(`${API_URL}/customers/${id}`, customerData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const deleteCustomer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const customerService = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};

export default customerService; 