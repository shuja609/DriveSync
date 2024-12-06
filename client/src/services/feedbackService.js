import api from './axiosConfig';

const FEEDBACK_URL = '/feedback';

export const getAllFeedback = async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
    });
    const response = await api.get(`${FEEDBACK_URL}?${queryParams}`);
    return response.data;
};

export const getFeedbackById = async (id) => {
    const response = await api.get(`${FEEDBACK_URL}/${id}`);
    return response.data;
};

export const createFeedback = async (feedbackData) => {
    const response = await api.post(FEEDBACK_URL, feedbackData);
    return response.data;
};

export const updateFeedbackStatus = async (id, status) => {
    const response = await api.patch(`${FEEDBACK_URL}/${id}/status`, { status });
    return response.data;
};

export const respondToFeedback = async (id, responseText) => {
    const response = await api.patch(`${FEEDBACK_URL}/${id}/respond`, { response: responseText });
    return response.data;
};

export const updateFeedbackPriority = async (id, priority) => {
    const response = await api.patch(`${FEEDBACK_URL}/${id}/priority`, { priority });
    return response.data;
}; 