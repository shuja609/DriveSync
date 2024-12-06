const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// Get all orders (admin only)
router.get('/', protect, adminOnly, orderController.getAllOrders);

// Get user's orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Get single order
router.get('/:id', protect, orderController.getOrderById);

// Create order
router.post('/', protect, orderController.createOrder);

// Update order status (admin only)
router.patch('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router; 