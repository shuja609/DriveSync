const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoute');
// const socialAuthRoutes = require('./socialAuthRoute');
// const userRoutes = require('./users');
const profileRoutes = require('./profileRoute');
// Import other route files as needed
// const productRoutes = require('./productRoute');
// const paymentRoutes = require('./paymentRoute');

// Define API routes
router.use('/api/auth', authRoutes);
// router.use('/api/auth/social', socialAuthRoutes);
// router.use('/api/users', userRoutes);
router.use('/api/profile', profileRoutes);
// Add other routes as needed
// router.use('/api/products', productRoutes);
// router.use('/api/payments', paymentRoutes);

module.exports = router;
