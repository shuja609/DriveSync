import api from './axiosConfig';

const analyticsService = {
    // Get analytics data
    async getAnalytics(timeRange = 'month') {
        try {
            const response = await api.get(`/analytics`, {
                params: { timeRange }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            throw error;
        }
    },

    // Export data in different formats
    async exportData(timeRange = 'month', format = 'csv') {
        try {
            const response = await api.get(`/analytics/export`, {
                params: { timeRange, format },
                responseType: 'blob'
            });

            return response.data;
        } catch (error) {
            console.error('Failed to export data:', error);
            throw error;
        }
    },

    // Get specific metric data
    async getMetricData(metricType, timeRange = 'month') {
        try {
            const response = await api.get(`/analytics/metrics/${metricType}`, {
                params: { timeRange }
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${metricType} metrics:`, error);
            throw error;
        }
    },

    // Generate custom report
    async generateReport(reportConfig) {
        try {
            const response = await api.post('/analytics/reports', reportConfig, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Failed to generate report:', error);
            throw error;
        }
    }
};

export default analyticsService; 