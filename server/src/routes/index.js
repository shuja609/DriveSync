const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoute');
const profileRoutes = require('./profileRoute');
const adminRoutes = require('./adminRoute');
const vehicleRoutes = require('./vehicleRoute');
const analyticsRoutes = require('./analyticsRoute');
const contentRoutes = require('./contentRoutes');
const feedbackRoutes = require('./feedbackRoute');
const userRoutes = require('./userRoute');
const reviewRoutes = require('./reviewRoute');
const bookingRoutes = require('./bookingRoute');
const inquiryRoutes = require('./inquiryRoute');
const orderRoutes = require('./orderRoute');
const transactionRoutes = require('./transactionRoute');
const paymentRoutes = require('./paymentRoute');
const accountRoutes = require('./accountRoute');
const geminiRoute = require('./geminiRoute');
const dashboardRoutes = require('./dashboardRoute');
const customerRoutes = require('./customerRoute');
const interactionRoutes = require('./interactionRoute');
const quotationRoutes = require('./quotationRoute');
const sellerInquiryRoutes = require('./sellerInquiryRoute');
const sellerOrderRoutes = require('./sellerOrderRoute');
const sellerDiscountRoutes = require('./sellerDiscountRoute');
const sellerFeedbackRoutes = require('./sellerFeedbackRoute');

// Define API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/content', contentRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/bookings', bookingRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/orders', orderRoutes);
router.use('/transactions', transactionRoutes);
router.use('/payments', paymentRoutes);
router.use('/account', accountRoutes);
router.use('/gemini', geminiRoute);
router.use('/dashboard', dashboardRoutes);
router.use('/customers', customerRoutes);
router.use('/interactions', interactionRoutes);
router.use('/quotations', quotationRoutes);
router.use('/sellerInquiries', sellerInquiryRoutes);
router.use('/sellerOrders', sellerOrderRoutes);
router.use('/sellerDiscounts', sellerDiscountRoutes);
router.use('/sellerFeedback', sellerFeedbackRoutes);

module.exports = router;
