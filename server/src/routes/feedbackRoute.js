const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getAllFeedback,
    getFeedbackById,
    createFeedback,
    updateFeedbackStatus,
    respondToFeedback,
    updateFeedbackPriority
} = require('../controllers/feedbackController');

// Validation middleware
const feedbackValidation = [
    body('type').isIn(['Bug Report', 'Feature Request', 'General', 'Support']),
    body('subject').trim().notEmpty().isLength({ min: 5, max: 100 }),
    body('message').trim().notEmpty().isLength({ min: 10, max: 1000 }),
    body('priority').optional().isIn(['Low', 'Medium', 'High'])
];

// Routes
router.get('/', protect, adminOnly, getAllFeedback);
router.get('/:id', protect, getFeedbackById);
router.post('/', protect, feedbackValidation, createFeedback);
router.patch('/:id/status', protect, adminOnly, body('status').isIn(['Open', 'In Progress', 'Closed']), updateFeedbackStatus);
router.patch('/:id/respond', protect, adminOnly, body('response').trim().notEmpty(), respondToFeedback);
router.patch('/:id/priority', protect, adminOnly, body('priority').isIn(['Low', 'Medium', 'High']), updateFeedbackPriority);

module.exports = router; 