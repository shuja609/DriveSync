const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation middleware
const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters')
];

// Public routes
router.get('/vehicle/:vehicleId', reviewController.getVehicleReviews);

// Protected routes (require authentication)
router.use(protect);

// User review routes
router.post('/vehicle/:vehicleId', validateReview, reviewController.createReview);
router.put('/:reviewId', validateReview, reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);
router.get('/user', reviewController.getUserReviews);

// Admin routes
router.use(adminOnly);
router.patch('/:reviewId/moderate', reviewController.moderateReview);

module.exports = router; 