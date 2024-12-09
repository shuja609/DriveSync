const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect, salesOnly } = require('../middleware/authMiddleware');

// Protect all routes - only sales representatives can access
router.use(protect, salesOnly);

// Routes will be added here after controller is created
router.post('/', quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotation);
router.patch('/:id/status', quotationController.updateQuotationStatus);
router.post('/:id/follow-up', quotationController.sendFollowUp);

module.exports = router; 