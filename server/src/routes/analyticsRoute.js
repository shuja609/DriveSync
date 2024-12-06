const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// Apply protection to all routes
router.use(protect);
router.use(adminOnly);

// Get analytics data
router.get('/', analyticsController.getAnalytics);

// Export data
router.get('/export', analyticsController.exportData);

// Get specific metric data
router.get('/metrics/:metricType', analyticsController.getMetricData);

// Generate custom report
router.post('/reports', analyticsController.generateReport);

module.exports = router; 