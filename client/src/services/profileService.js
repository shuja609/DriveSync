import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

class ProfileService {
    async getSetupProgress() {
        const response = await axios.get(`${API_URL}/profile/setup-progress`, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async setupBasicInfo(data) {
        const response = await axios.post(`${API_URL}/profile/setup/basic-info`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async setupProfilePicture(imageUrl) {
        const response = await axios.post(`${API_URL}/profile/setup/profile-picture`, {
            profilePicture: imageUrl
        }, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async updateProfilePicture(imageUrl) {
        const response = await axios.put(`${API_URL}/profile/setup/profile-picture`, {
            profilePicture: imageUrl
        }, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async setupPersonalInfo(data) {
        const response = await axios.post(`${API_URL}/profile/setup/personal-info`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async setupAddress(data) {
        const response = await axios.post(`${API_URL}/profile/setup/address`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async setupPreferences(data) {
        const response = await axios.post(`${API_URL}/profile/setup/preferences`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async completeSetup() {
        try {
            const response = await axios.post(`${API_URL}/profile/setup/complete`, {}, {
                headers: getAuthHeader()
            });
            
            if (response.data.success && response.data.user) {
                const userData = {
                    ...response.data,
                    user: {
                        ...response.data.user,
                        isProfileComplete: true
                    }
                };
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            return response.data;
        } catch (error) {
            console.error('Complete setup error:', error);
            throw error.response?.data || error;
        }
    }

    async skipStep(step) {
        const response = await axios.post(`${API_URL}/profile/setup/skip/${step}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async updateProfile(data) {
        try {
            const response = await axios.put(`${API_URL}/profile/update`, data, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async addEmail(email) {
        try {
            const response = await axios.post(
                `${API_URL}/profile/emails/add`,
                { email },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async setPrimaryEmail(email) {
        try {
            const response = await axios.post(
                `${API_URL}/profile/emails/primary`,
                { email },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async removeEmail(email) {
        try {
            const response = await axios.delete(
                `${API_URL}/profile/emails/${email}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async verifyAdditionalEmail(token) {
        try {
            const response = await axios.get(
                `${API_URL}/profile/emails/verify/${token}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

// Create and export the instance properly
const profileServiceInstance = new ProfileService();
export default profileServiceInstance; 