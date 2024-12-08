const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
const { protect } = require('../middleware/authMiddleware');

// Route for handling user queries
router.post('/query', protect, geminiController.handleQuery);

// Route for getting AI capabilities
router.get('/capabilities', protect, geminiController.getCapabilities);

module.exports = router; 