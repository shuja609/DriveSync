const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

// Get all transactions (admin only)
router.get('/', protect, adminOnly, transactionController.getAllTransactions);

// Get user's transactions
router.get('/my-transactions', protect, transactionController.getMyTransactions);

// Get single transaction
router.get('/:id', protect, transactionController.getTransactionById);

// Process payment
router.post('/process-payment', protect, transactionController.processPayment);

// Process refund (admin only)
router.post('/process-refund', protect, adminOnly, transactionController.processRefund);

module.exports = router; 