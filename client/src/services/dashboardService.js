import axiosConfig from './axiosConfig';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};




const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const dashboardService = {
    getDashboardStats
};

export default dashboardService; 