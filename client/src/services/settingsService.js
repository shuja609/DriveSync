import api from './axiosConfig';

export const getAdminSettings = async () => {
    const response = await api.get('/admin/settings');
    return response.data;
};

export const updateAdminSettings = async (section, data) => {
    const response = await api.put(`/admin/settings/${section}`, data);
    return response.data;
};

export const testEmailSettings = async () => {
    const response = await api.post('/admin/settings/email/test');
    return response.data;
};

export const backupDatabase = async () => {
    const response = await api.post('/admin/settings/backup');
    return response.data;
};

export const restoreDatabase = async (backupFile) => {
    const formData = new FormData();
    formData.append('backup', backupFile);
    const response = await api.post('/admin/settings/restore', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}; 