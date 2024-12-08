const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, salesOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, salesOnly, getDashboardStats);

module.exports = router; 