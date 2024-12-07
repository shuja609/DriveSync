const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation middleware
const validateBooking = [
    body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    body('type').isIn(['reservation', 'test_drive']).withMessage('Invalid booking type'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
    body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
    body('contactInfo.email').isEmail().withMessage('Invalid email address'),
    body('contactInfo.phone').matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number'),
    body('location').if(body('type').equals('test_drive')).notEmpty().withMessage('Location is required for test drives'),
    body('paymentMethod').if(body('type').equals('reservation')).isIn(['cash', 'card', 'bank_transfer']).withMessage('Invalid payment method'),
    body('duration').if(body('type').equals('reservation')).isInt({ min: 1 }).withMessage('Duration must be at least 1 day')
];

// Protected routes (require authentication)
router.use(protect);

// User routes
router.post('/', validateBooking, bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);
router.put('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/cancel', bookingController.cancelBooking);

// Admin routes
router.use(adminOnly);
router.get('/', bookingController.getAllBookings);

module.exports = router; 