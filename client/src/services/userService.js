import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

class UserService {
    async getUsers(filters = {}) {
        try {
            const response = await axios.get(`${API_URL}/admin/users`, {
                headers: getAuthHeader(),
                params: filters
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async createUser(userData) {
        try {
            const response = await axios.post(`${API_URL}/admin/users`, userData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async deleteUser(userId) {
        try {
            const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateUserRole(userId, role) {
        try {
            const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async updateUserStatus(userId, status) {
        try {
            const response = await axios.put(`${API_URL}/admin/users/${userId}/status`, { status }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

export default new UserService(); 