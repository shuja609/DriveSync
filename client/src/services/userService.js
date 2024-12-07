import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const userApi = axios.create({
    baseURL: `${API_URL}/users`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
userApi.interceptors.request.use((config) => {
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

class UserService {
    // Get saved cars
    async getSavedCars() {
        try {
            const response = await userApi.get('/saved-cars');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Save a car
    async saveCar(carId, notes = '') {
        try {
            const response = await userApi.post('/saved-cars', { carId, notes });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Remove a saved car
    async removeSavedCar(carId) {
        try {
            const response = await userApi.delete(`/saved-cars/${carId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update saved car notes
    async updateSavedCarNotes(carId, notes) {
        try {
            const response = await userApi.put(`/saved-cars/${carId}/notes`, { notes });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    handleError(error) {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.response) {
            // Server responded with error
            errorMessage = error.response.data.message || 'Server error';
            const err = new Error(errorMessage);
            err.status = error.response.status;
            err.data = error.response.data;
            throw err;
        } else if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Please try again.');
        } else {
            // Request setup error
            throw new Error(error.message || errorMessage);
        }
    }
}

export default new UserService(); 