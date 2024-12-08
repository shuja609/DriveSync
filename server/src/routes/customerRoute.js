const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');
const { protect, salesOnly } = require('../middleware/authMiddleware');

// All routes are protected for sales representatives
router.use(protect, salesOnly);

router.route('/')
    .get(getCustomers)
    .post(createCustomer);

router.route('/:id')
    .get(getCustomer)
    .put(updateCustomer)
    .delete(deleteCustomer);

module.exports = router; 