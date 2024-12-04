const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);

// Protected routes (require authentication)
router.use(protect);

// Admin only routes
router.use(adminOnly);

// Vehicle CRUD operations
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router; 