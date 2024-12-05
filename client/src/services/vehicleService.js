import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const vehicleApi = axios.create({
    baseURL: `${API_URL}/vehicles`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
vehicleApi.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
        try {
            const { token } = JSON.parse(userData);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    return config;
});

const vehicleService = {
    // Get all vehicles with filters
    async getVehicles(params = {}) {
        const response = await vehicleApi.get('/', { params });
        return response.data;
    },

    // Get single vehicle
    async getVehicle(id) {
        const response = await vehicleApi.get(`/${id}`);
        return response.data;
    },

    // Create new vehicle
    async createVehicle(vehicleData) {
        const response = await vehicleApi.post('/', vehicleData);
        return response.data;
    },

    // Update vehicle
    async updateVehicle(id, updates) {
        const response = await vehicleApi.put(`/${id}`, updates);
        return response.data;
    },

    // Delete vehicle
    async deleteVehicle(id) {
        const response = await vehicleApi.delete(`/${id}`);
        return response.data;
    }
};

export default vehicleService; 