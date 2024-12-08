const express = require('express');
const router = express.Router();
const { getCustomerInteractions } = require('../controllers/interactionController');
const { protect, salesOnly } = require('../middleware/authMiddleware');

router.get('/:customerId', protect, salesOnly, getCustomerInteractions);

module.exports = router; 