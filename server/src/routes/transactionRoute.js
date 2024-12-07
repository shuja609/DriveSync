const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
// None

// Protected routes (logged in users)
router.post('/', protect, transactionController.createTransaction);
router.get('/my-transactions', protect, transactionController.getUserTransactions);
router.get('/:id', protect, transactionController.getTransactionById);

// Admin routes
router.get('/', protect, adminOnly, transactionController.getAllTransactions);

module.exports = router; 