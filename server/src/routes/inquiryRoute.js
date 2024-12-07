const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation middleware
const validateInquiry = [
    body('subject').notEmpty().trim().isLength({ max: 100 }).withMessage('Subject is required and must be less than 100 characters'),
    body('message').notEmpty().trim().isLength({ max: 1000 }).withMessage('Message is required and must be less than 1000 characters'),
    body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
    body('contactInfo.email').isEmail().withMessage('Invalid email address'),
    body('contactInfo.phone').optional().matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number')
];

const validateResponse = [
    body('message').notEmpty().trim().isLength({ max: 1000 }).withMessage('Response message is required and must be less than 1000 characters')
];

// Protected routes (require authentication)
router.use(protect);

// User routes
router.post('/', validateInquiry, inquiryController.createInquiry);
router.get('/user', inquiryController.getUserInquiries);

// Admin routes
router.use(adminOnly);
router.get('/', inquiryController.getAllInquiries);
router.post('/:id/response', validateResponse, inquiryController.addResponse);
router.put('/:id/status', inquiryController.updateStatus);

module.exports = router; 