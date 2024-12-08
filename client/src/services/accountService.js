import axiosConfig from './axiosConfig';

const accountService = {
    // Get account settings
    getAccountSettings: async () => {
        const response = await axiosConfig.get('/account');
        return response.data;
    },

    // Update personal information
    updatePersonalInfo: async (data) => {
        const response = await axiosConfig.put('/account/personal-info', data);
        return response.data;
    },

    // Update address
    updateAddress: async (data) => {
        const response = await axiosConfig.put('/account/address', data);
        return response.data;
    },

    // Update preferences
    updatePreferences: async (data) => {
        const response = await axiosConfig.put('/account/preferences', data);
        return response.data;
    }
};

export default accountService; 