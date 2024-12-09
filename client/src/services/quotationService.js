import axiosConfig from './axiosConfig';

// Create new quotation
const createQuotation = async (quotationData) => {
    try {
        const response = await axiosConfig.post('/quotations', quotationData);
        return response.data;
    } catch (error) {
        console.error('Create Quotation Error:', error);
        throw error.response?.data || { message: 'Error creating quotation' };
    }
};

// Get all quotations
const getQuotations = async (filters = {}) => {
    try {
        const response = await axiosConfig.get('/quotations', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Get Quotations Error:', error);
        throw error.response?.data || { message: 'Error fetching quotations' };
    }
};

// Get single quotation
const getQuotation = async (id) => {
    try {
        const response = await axiosConfig.get(`/quotations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Quotation Error:', error);
        throw error.response?.data || { message: 'Error fetching quotation' };
    }
};

// Update quotation status
const updateQuotationStatus = async (id, status) => {
    try {
        const response = await axiosConfig.patch(`/quotations/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Update Quotation Status Error:', error);
        throw error.response?.data || { message: 'Error updating quotation status' };
    }
};

// Send follow-up email
const sendFollowUp = async (id) => {
    try {
        const response = await axiosConfig.post(`/quotations/${id}/follow-up`);
        return response.data;
    } catch (error) {
        console.error('Send Follow-up Error:', error);
        throw error.response?.data || { message: 'Error sending follow-up email' };
    }
};

// Delete quotation
const deleteQuotation = async (id) => {
    try {
        const response = await axiosConfig.delete(`/quotations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete Quotation Error:', error);
        throw error.response?.data || { message: 'Error deleting quotation' };
    }
};

// Generate PDF
const generatePDF = async (id) => {
    try {
        const response = await axiosConfig.get(`/quotations/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Generate PDF Error:', error);
        throw error.response?.data || { message: 'Error generating PDF' };
    }
};

const quotationService = {
    createQuotation,
    getQuotations,
    getQuotation,
    updateQuotationStatus,
    sendFollowUp,
    deleteQuotation,
    generatePDF
};

export default quotationService;