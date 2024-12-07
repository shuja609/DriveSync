const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
// None

// Protected routes (logged in users)
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.patch('/:id/shipping', protect, orderController.updateShippingDetails);
router.post('/:id/notes', protect, orderController.addOrderNote);

// Admin routes
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.patch('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router; 