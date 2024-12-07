const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Process payment for an order
router.post('/process/:orderId', protect, paymentController.processPayment);

// Get payment status
router.get('/status/:orderId', protect, paymentController.getPaymentStatus);

module.exports = router; 