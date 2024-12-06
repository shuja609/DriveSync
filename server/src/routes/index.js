const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoute');
const profileRoutes = require('./profileRoute');
const adminRoutes = require('./adminRoute');
const vehicleRoutes = require('./vehicleRoute');
const orderRoutes = require('./orderRoute');
const transactionRoutes = require('./transactionRoute');
const analyticsRoutes = require('./analyticsRoute');
const contentRoutes = require('./contentRoutes');
const feedbackRoutes = require('./feedbackRoute');

// Define API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/orders', orderRoutes);
router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/content', contentRoutes);
router.use('/feedback', feedbackRoutes);

module.exports = router;
