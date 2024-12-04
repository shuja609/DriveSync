const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);
router.use(adminOnly);

// User management routes
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.updateUserStatus);

module.exports = router; 