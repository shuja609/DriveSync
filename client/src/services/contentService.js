import api from './axiosConfig';

// Video Management
export const createVideo = async (videoData) => {
    const response = await api.post('/content/videos', videoData);
    return response.data;
};

export const getAllVideos = async (params = {}) => {
    const response = await api.get('/content/videos', { params });
    return response.data;
};

export const getVideoById = async (id) => {
    const response = await api.get(`/content/videos/${id}`);
    return response.data;
};

export const updateVideo = async (id, videoData) => {
    const response = await api.put(`/content/videos/${id}`, videoData);
    return response.data;
};

export const deleteVideo = async (id) => {
    const response = await api.delete(`/content/videos/${id}`);
    return response.data;
};

export const toggleVideoPublish = async (id) => {
    const response = await api.patch(`/content/videos/${id}/publish`);
    return response.data;
};

export const getVideoAnalytics = async () => {
    const response = await api.get('/content/videos/analytics');
    return response.data;
};